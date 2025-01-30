import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptBarComponent } from './prompt-bar.component';

describe('PromptbarComponent', () => {
  let component: PromptBarComponent;
  let fixture: ComponentFixture<PromptBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
