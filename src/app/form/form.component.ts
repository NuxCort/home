import { Component, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { userModel } from '../models/user.model';
import { Animations } from '../shared/animations';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  animations: [Animations.fadeInOut]
})

export class FormComponent extends userModel{
  
  @Input() matcher = new ErrorStateMatcher();
  @Output() Email = new FormControl("", [Validators.required, Validators.email]);
  @Output() Name = new FormControl("", [Validators.required]);
  @Output() Age = new FormControl("", [Validators.required]);
  
  public user = new userModel;
  
  public form!: FormGroup;
  public nameBind!: string;
  public ageBind!: number;
  public emailBind!: string;

  constructor(){
    super();
  }

  public saveObject(): void {
    
    this.user.age = this.ageBind;
    this.user.name = this.nameBind;
    this.user.email = this.emailBind;

    this.user.email = "";

  }
} 


