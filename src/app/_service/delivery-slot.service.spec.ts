import { TestBed } from '@angular/core/testing';

import { DeliverySlotService } from './delivery-slot.service';

describe('DeliverySlotService', () => {
  let service: DeliverySlotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliverySlotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
