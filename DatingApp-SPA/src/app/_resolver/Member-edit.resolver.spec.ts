import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { MemberEditResolver } from './member-edit.resolver';



describe('memberEditResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => MemberEditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
