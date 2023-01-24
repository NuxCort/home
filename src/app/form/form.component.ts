import { Component, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { userModel } from '../models/user.model';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  animations: []
})

export class FormComponent extends userModel{
  
  @Input() matcher = new ErrorStateMatcher();
  @Output() Email = new FormControl("", [Validators.required, Validators.email]);
  @Output() Name = new FormControl("", [Validators.required]);
  @Output() Age = new FormControl("", [Validators.required]);
  
  
  public form!: FormGroup;
  public nameBind!: string;
  public ageBind!: number;
  public emailBind!: string;

  constructor(){
    super();
  }

  public saveObject(): void {
    let user = new userModel;
    user.age = this.ageBind;
    user.name = this.nameBind;
    user.email = this.emailBind;

    console.log(user)
    console.log(JSON.stringify(user))
  }
}

// let User = {
//   name: "",
//   age: 0,
//   email: ""
// }


