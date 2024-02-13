import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-prompt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './prompt-dialog.component.html',
  styleUrl: './prompt-dialog.component.scss'
})
export class PromptDialogComponent {
  promptForm: FormGroup;

   constructor(
     @Inject(MAT_DIALOG_DATA) public data: PromptDialogData,
     private dialog: MatDialogRef<PromptDialogComponent, string | null>
   ) { 
     this.promptForm = new FormGroup({
       value: new FormControl(data.initialValue ?? '', Validators.required)
     });
   }
  
  closeDialog(cancel: boolean) {
    if (!cancel && this.promptForm.invalid) return;
    this.dialog.close(cancel ? null : this.valueInput?.value)
  }
  
  get valueInput() {
    return this.promptForm.get("value");
  }

  get inputType(): string {
    return this.data.inputType ?? "text";
  }

  get errorText(): string {
    return this.data.errorText ?? "Please enter value";
  }
}

export type PromptDialogData = { 
  title: string;
  text: string;
  label: string;
  initialValue?: string | number;
  inputType?: string;
  errorText?: string;
}
