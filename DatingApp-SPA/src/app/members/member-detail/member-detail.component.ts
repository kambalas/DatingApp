import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { User } from 'src/app/_modules/User';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user : User | undefined;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  constructor(private userService: UserService, private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadUser();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
  }
  getImages() {
    if(!this.user || !this.user.photos) return [];
    const imageUrls = [];
    console.log("hey!");
    for(const photo of this.user.photos) {
      imageUrls.push({
        small:photo.url,
        medium:photo.url,
        big:photo.url,
      })
    }
    return imageUrls;
  }

  loadUser() {
    this.userService.getUser(this.route.snapshot.params['id']).subscribe((user: User) => {
      this.user = user;
      this.galleryImages=this.getImages();
    }, error => {
      this.alertify.error(error);
    });
  }


}
