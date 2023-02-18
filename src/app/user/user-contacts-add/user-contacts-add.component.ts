import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/_services/contact.service';
import { StorageService } from 'src/app/_services/storage.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-contacts-add',
  templateUrl: './user-contacts-add.component.html',
  styleUrls: ['./user-contacts-add.component.css']
})
export class UserContactsAddComponent implements OnInit {

  form: any = {
    name: null,
    phone: null,
    adress: null,
  }
  
  isLoggedIn: boolean = false;
  userId: number;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    private contactService: ContactService, 
    private router: Router, 
    private toastService: ToastService, 
    private storageService: StorageService, 
    private userService: UserService,
    ) {
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe(userId => {
        if (userId) {
          this.userId = userId;
          this.isLoggedIn = true;
        }
      });
    }
  }

  ngOnInit(): void {
   
  }

  onSubmit() {
    const {name, phone, adress} = this.form;
    this.contactService.addContact(name, adress, phone).subscribe({
      next: response => {
        console.log(response);
        
      }, error: err => {
        console.log(err);
        
      }, complete: () => {
        this.router.navigate([`/user/${this.userId}/contacts`]);
        this.toastService.show('Le contact a bien été ajouté.', `test`, {  delay: 3000 });
      }
    })
  }
}
