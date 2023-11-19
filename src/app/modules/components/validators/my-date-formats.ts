import { MatDateFormats } from '@angular/material/core';

export const MY_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'DD-Mmm-yyyy',
      },
      display: {
        dateInput: 'DD-MMM-yyyy',
        monthYearLabel: 'DD-MMM-yyyy',
        dateA11yLabel: 'DD-MMM-yyyy',
        monthYearA11yLabel: 'MMMM yyyy',
      },
};
