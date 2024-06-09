import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningSentenceComponent } from './opening-sentence.component';

describe('OpeningSentenceComponent', () => {
  let component: OpeningSentenceComponent;
  let fixture: ComponentFixture<OpeningSentenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpeningSentenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpeningSentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
