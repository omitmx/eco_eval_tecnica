import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgModalComponent } from './msg-modal.component';

describe('MsgModalComponent', () => {
  let component: MsgModalComponent;
  let fixture: ComponentFixture<MsgModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsgModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MsgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
