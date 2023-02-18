import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from 'src/app/models/contact';
import { ContactService } from 'src/app/_services/contact.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-contacts',
  templateUrl: './user-contacts.component.html',
  styleUrls: ['./user-contacts.component.css']
})
export class UserContactsComponent implements OnInit {

  isLoggedIn: boolean = false;
  userId: number;
  userContacts: Contact[];

  constructor(
    private router: Router, 
    private storageService: StorageService, 
    private userService: UserService,
    private contactService: ContactService, 
    ) {

  }
  
  ngOnInit(): void {
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe(userId => {
        if (userId) {
          this.userId = userId;
          this.isLoggedIn = true;
        }
      }).unsubscribe();
    }
    this.contactService.getUserContacts().subscribe({
      next: response => {
        console.log(response);
        this.userContacts = response;
      }
    })
  }
  
  goToNewContact() {
    this.router.navigate([`/user/${this.userId}/contacts/ajouter`])
  }
}
