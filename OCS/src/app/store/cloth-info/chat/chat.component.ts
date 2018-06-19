import {Component, Input, ViewChild} from '@angular/core';
import {UserService} from "../../../services/UserService";
import {ChatService} from "../../../services/ChatService";
import {Message} from "../../../models/message.model";
import {Cloth} from "../../../models/cloth.model";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @ViewChild('messages') messagesList;
  @ViewChild('inputMessage') inputMessage;
  @Input() cloth: Cloth;

  allMessages: Message[] = [];
  userName: string = null;
  isEnabled: boolean = false;
  isTyping: boolean = false;
  placeHolder: string = "";

  typeHere: string = "Type here...";
  notConnected: string = "You are not logged in";
  typing: string = " is typing...";

  constructor(private chatService: ChatService, private userService: UserService) {
    var self = this;

    userService.event.subscribe(function(value) {
      self.setUserName(value['user']);
    });

    chatService.newMessageEvent.subscribe(function (data) {
      var message = new Message(null, data['username'], data['message']);
      self.allMessages.push(message);
    });

    chatService.typingEvent.subscribe(function (data) {
      self.placeHolder = data['username'] + self.typing;
    });

    chatService.stopTypingEvent.subscribe(function () {
      self.placeHolder = self.typeHere;
    });
  }

  onOpenChat() {
    this.placeHolder = this.notConnected;
    this.setUserName(null);

    var self = this;

    this.chatService.getMessages(this.cloth.id, function (res) {
      if (res.status !== "error") {
        for (var i = 0; i < res.messages.length; i++) {
          var message = new Message(null, res.messages[i]['username'], res.messages[i]['message']);
          self.allMessages.push(message);
        }

        self.scrollToBottom();
        self.chatService.listen();
      }
    });
  }

  onCloseChat() {
    this.allMessages = [];
    this.chatService.stopListen();
  }

  setUserName(user) {
    var userData = user || this.userService.user;

    this.isEnabled = !!userData;
    this.userName = (userData) ? userData.fullName : null;

    if (this.isEnabled) {
      this.placeHolder = this.typeHere;
      this.chatService.setUser(this.userName);
    }
  }

  scrollToBottom() {
    var self = this;
    setTimeout(function () {
      self.messagesList.nativeElement.scrollTop = self.messagesList.nativeElement.scrollHeight;
    }, 0);
  }

  onInputChange() {
    if (this.isEnabled) {
      var message = this.inputMessage.nativeElement.value;

      if (message.length > 0 && !this.isTyping) {
        this.isTyping = true;
        this.chatService.setTyping(true);
      }

      if (message.length == 0 && this.isTyping) {
        this.isTyping = false;
        this.chatService.setTyping(false);
      }

    }
  }

  onSend() {
    if (this.isEnabled) {
      var message = this.inputMessage.nativeElement.value;
      if (message && message.length > 0) {
        this.chatService.sendMessage(this.cloth.id, message);
      }

      this.inputMessage.nativeElement.value = "";
      this.chatService.setTyping(false);
    }
  }
}
