import {Injectable} from '@angular/core';
import {Socket} from 'ng-socket-io';
import {Subject} from "rxjs/Subject";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ChatService {
  newMessageEvent: Subject<object> = new Subject<object>();
  typingEvent: Subject<object> = new Subject<object>();
  stopTypingEvent: Subject<object> = new Subject<object>();

  userName: string;

  constructor(private socket: Socket, private http: HttpClient) {
  }

  setUser(userName) {
    this.userName = userName;
    this.socket.emit('add user', userName);
  }

  sendMessage(id, message) {
    var self = this;
    this.http.post("http://localhost:3000/message/addMessage", {
      id: id,
      username: this.userName,
      message: message
    }).subscribe(
      function (res) {
        self.socket.emit('new message', message);
      }
    );
  }

  setTyping(isTyping) {
    if (isTyping) {
      this.socket.emit('typing');
    } else {
      this.socket.emit('stop typing');
    }
  }

  listen() {
    var self = this;
    this.socket.on('new message', function (data) {
      self.newMessageEvent.next(data);
    });

    this.socket.on('typing', function (data) {
      self.typingEvent.next(data);
    });

    this.socket.on('stop typing', function (data) {
      self.stopTypingEvent.next(data);
    });
  }

  getMessages(id, cb) {
    return this.http.get("http://localhost:3000/message/getMessages/" + id).subscribe(
      function(res) {
        var messages = res["messages"];
        cb({status: "success", messages: messages});
      },
      function(err) {
        cb({status: "error", message: err.error.message});
      }
    )
  }

  stopListen() {
    this.socket.removeAllListeners('new message');
    this.socket.removeAllListeners('typing');
    this.socket.removeAllListeners('stop typing');
  }
}
