import { FormGroup } from '@angular/forms';

export default class Validation {
  static match(controlName: string, checkControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const checkControl = formGroup.controls[checkControlName];

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        checkControl?.setErrors({ matching: true });
        return { matching: true };
      } else {
        checkControl?.setErrors(null);
        return null;
      }
    };
  }
}
