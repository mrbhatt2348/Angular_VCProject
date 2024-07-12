import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import { AdminsideServiceService } from 'src/app/service/adminside-service.service';
import { AdminloginService } from 'src/app/service/adminlogin.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    private service: AdminloginService,
    private toastr: ToastrService,
    public activateRoute: ActivatedRoute,
    private router: Router,
    public toast: NgToastService
  ) { }

  updateForm: FormGroup;
  formValid: boolean;
  userId: string;
  updateData: any;

  ngOnInit(): void {
    this.createUpdateForm();
    this.userId = this.activateRoute.snapshot.paramMap.get('Id');
    if (this.userId) {
      this.FetchDetail(this.userId);
    }
  }

  createUpdateForm() {
    this.updateForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(30)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      address: ['', [Validators.required, Validators.maxLength(90)]],
      emailAddress: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required]
    }, { validator: [this.passwordCompareValidator] });
  }

  passwordCompareValidator(fc: AbstractControl): ValidationErrors | null {
    return fc.get('password')?.value === fc.get('confirmPassword')?.value ? null : { notmatched: true };
  }

  get firstName() {
    return this.updateForm.get('firstName') as FormControl;
  }
  get lastName() {
    return this.updateForm.get('lastName') as FormControl;
  }
  get phoneNumber() {
    return this.updateForm.get('phoneNumber') as FormControl;
  }
  get address() {
    return this.updateForm.get('address') as FormControl;
  }
  get emailAddress() {
    return this.updateForm.get('emailAddress') as FormControl;
  }
  get password() {
    return this.updateForm.get('password') as FormControl;
  }
  get confirmPassword() {
    return this.updateForm.get('confirmPassword') as FormControl;
  }

  FetchDetail(id: any) {
    this.service.GetUserById(id).subscribe((data: any) => {
      this.updateData = data.data;
      this.updateForm.patchValue({
        id: this.updateData.id,
        firstName: this.updateData.firstName,
        lastName: this.updateData.lastName,
        phoneNumber: this.updateData.phoneNumber,
        address: this.updateData.address,
        emailAddress: this.updateData.emailAddress,
        password: this.updateData.password,
        confirmPassword: this.updateData.confirmPassword
      });
    });
  }

  onSubmit() {
    this.formValid = true;
    if (this.updateForm.valid) {
      let updatedUserData = this.updateForm.value;
      this.service.UpdateUser(updatedUserData).subscribe((data: any) => {
        if (data.result == 1) {
          this.toast.success({ detail: "SUCCESS", summary: data.data, duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['userPage']);
          }, 1000);
        } else {
          this.toast.error({ detail: "ERROR", summary: data.message, duration: 3000 });
        }
      }, err => this.toast.error({ detail: "ERROR", summary: err.message, duration: 3000 }));
      this.formValid = false;
    }
  }
}
