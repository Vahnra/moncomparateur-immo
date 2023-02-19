import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { CalendarService } from 'src/app/_services/calendar.service';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-user-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-calendar.component.html',
  styleUrls: ['./user-calendar.component.css']
})
export class UserCalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  
  userId: number;
  user: User;
  roles: any;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  locale: string = "fr";
  
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  form: any = {
    title: null,
    startDate: null,
  }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;

  constructor(private modal: NgbModal, private calendarService: CalendarService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe( data => {
      
      this.user = data;
      this.roles = data.status;
  
        if (data.status == 'paid') {
           
          this.calendarService.getAllCalendarEvents().subscribe({
            next: response => {
              response.forEach(element => {      
                let event: any = {};
                event['title'] = element.title;
                event['start'] = new Date(element.start);
                event["allDay"] = element.all_day;
                this.events.push(event);
              });  
            }, error: err => {
              console.log(err);  
            }, complete: () => {
              this.refresh.next();
            }
          })
        } else {
          this.roles = 'free';
          this.refresh.next();
        }    
       
    })

    
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
    console.log(this.events);
    
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  onSubmit(): void {
    const title = this.form.title;
    const startDate = new Date(this.form.startDate);

    this.calendarService.addCalendarEvent(title, startDate).subscribe({
      next: response => {
        console.log(response);
        
      }, error: err => {
        console.log(err); 
      }
    })
  }
}
 