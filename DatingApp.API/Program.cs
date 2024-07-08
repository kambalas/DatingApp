using DatingApp.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Mvc;

internal class Program
{
    private static void Main(string[] args)
    {


        var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      builder =>
                      {
                          builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                      });
});
        

        // Add services to the container.
        builder.Services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
            .AddJsonOptions(opt => {
                opt.JsonSerializerOptions.ReferenceHandler = 
                    System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
            });
        builder.Services.AddAutoMapper(typeof(DatingRepository).Assembly);
        builder.Services.AddScoped<IAuthRepository, AuthRepository>();
        builder.Services.AddScoped<IDatingRepository, DatingRepository>();
        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddDbContext<DataContext>(x => x.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                        .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

        var app = builder.Build();
        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            try {
                var context = services.GetRequiredService<DataContext>();
                context.Database.Migrate();
                Console.WriteLine("hey!");
                Seed.SeedUsers(context);
            }
            catch(Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "Error occured");
            }
        }
        

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseExceptionHandler(builder => {
                builder.Run(async context => {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                    var error = context.Features.Get<IExceptionHandlerFeature>();

                    if (error != null)
                    {
                        context.Response.AddApplicationError(error.Error.Message);  
                        await context.Response.WriteAsync(error.Error.Message);
                    }
                });
            });
        }
        app.UseCors(MyAllowSpecificOrigins);
        app.UseAuthentication();
        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}