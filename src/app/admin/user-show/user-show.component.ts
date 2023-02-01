import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/_services/user.service';


/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-user-show',
  templateUrl: './user-show.component.html',
  styleUrls: ['./user-show.component.css']
})
export class UserShowComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'username', 'email', 'phone_numbers', 'postal_code', 'birthday_date'];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService) { }

  ngAfterViewInit() {

    this.userService.getAllUsers().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);   
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


