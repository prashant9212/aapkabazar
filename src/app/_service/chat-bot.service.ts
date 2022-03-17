import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io/node_modules/socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {

  socket: any

  constructor(private http:HttpClient) { 
    this.socket = io.connect(`${environment.socketURL}`,{ transports: ['websocket',"polling"],
    secure:true,
    reconnect: true,
    rejectUnauthorized : false});
  }

    listen(event) { 
      return new Observable((subscribe) => {
        this.socket.on(event, (data) => {
          console.log(event)
          subscribe.next(data)
        })
      })
    }

    emit(event,data){
      console.log('event',event)
      this.socket.emit(event,data)
    }

  getChatDetail(orderId){
    return this.http.get(environment.apiUrl+`chat/${orderId}`)
  }

  offlineOtherChat(){
    return this.http.get(environment.apiUrl+`offline`)
  }
}
