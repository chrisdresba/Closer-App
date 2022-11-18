import { TestBed } from '@angular/core/testing';

import { UsrPushRolTokenService } from './usr-push-rol-token.service';

describe('UsrPushRolTokenService', () => {
  let service: UsrPushRolTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsrPushRolTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
