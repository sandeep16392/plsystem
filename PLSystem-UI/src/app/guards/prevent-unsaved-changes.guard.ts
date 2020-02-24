import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { PLApprovalComponent } from '../PLApproval/PLApproval.component';

@Injectable()
export class PreventUnsavedChangesGuard
  implements CanDeactivate<PLApprovalComponent> {
  canDeactivate(component: PLApprovalComponent) {
    if (component) {
      return confirm(
        'Are you sure you want to continue? Any unsaved changes would be lost.'
      );
    }
    return true;
  }
}
