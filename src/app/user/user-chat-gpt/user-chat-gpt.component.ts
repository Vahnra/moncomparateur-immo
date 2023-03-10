import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Configuration, OpenAIApi } from 'openai';
import { timeout } from 'rxjs';
import { gptModels } from 'src/app/models/gpt-models';
import { ChatWithBot, ResponseModel } from 'src/app/models/gpt-response';
import { User } from 'src/app/models/user';
import { ProjectService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-chat-gpt',
  templateUrl: './user-chat-gpt.component.html',
  styleUrls: ['./user-chat-gpt.component.css']
})
export class UserChatGPTComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chatConversation: ChatWithBot[] = [];
  response!: ResponseModel | undefined;
  gptModels = gptModels;
  promptText = '';
  showSpinner = false;
  userId: string|number;
  user: User;
  roles: string;
  isLoggedIn: boolean = false;

  constructor(
    private projectService: ProjectService, 
    private router: Router, 
    private storageService: StorageService, 
    private userService: UserService
    ) { }

  ngOnInit(): void {

    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe({
        next: user => {
          if (user) {
            this.userId = user.id;
            this.isLoggedIn = true;
            this.roles = user.status;
          }
        }, error: err => {

        }, complete: () => {

        }
      });
    }
    
  }

  ngAfterViewInit(){
   
    setTimeout(() => {
      this.pushChatContent('Comment puis-je vous aider ?', 'Mr Bot', 'bot ms-auto');
      // let test = new Audio('assets/among_us_chat.mp3');
      // test.play();
    }, 2000)
  }

  ngAfterViewChecked() {
    
    this.scrollToBottom();
  }

  checkResponse() {
    this.pushChatContent(this.promptText, 'Vous', 'person');
    this.invokeGPT();
  }

  pushChatContent(content: string, person: string, cssClass: string) {
    const chatToPush: ChatWithBot = { person: person, response: content, cssClass: cssClass };
    this.chatConversation.push(chatToPush);
  }

  getText(data: string) {
    return data.replace(/\n/g, '<br/>');
  }

  async invokeGPT() {

    if (this.promptText.length < 2)
      return;

    try {
      this.response = undefined;
      let configuration = new Configuration({ apiKey: environment.apiKey });
      let openai = new OpenAIApi(configuration);

      let requestData = {
        model: 'text-davinci-003',//'text-davinci-003',//"text-curie-001",
        prompt: this.promptText,//this.generatePrompt(animal),
        temperature: 0.95,
        max_tokens: 1000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      };
      this.promptText = '';
      this.showSpinner = true;
      let apiResponse = await openai.createCompletion(requestData);
      
      this.response = apiResponse.data as ResponseModel;
      let responseFormat = this.response.choices[0].text;
 
      this.pushChatContent(responseFormat, 'Mr Bot', 'bot ms-auto test');

      let test = new Audio('assets/among_us_chat.mp3');

      test.play();

      this.scrollToBottom();
       
      this.showSpinner = false;

    } catch (error: any) {
      this.showSpinner = false;
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);

      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);

      }
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
