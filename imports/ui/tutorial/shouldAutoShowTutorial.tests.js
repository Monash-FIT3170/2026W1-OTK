import { assert } from 'chai';
import { shouldAutoShowTutorial } from './shouldAutoShowTutorial';

describe('shouldAutoShowTutorial', function () {
  it('returns true for a user who has not seen the tutorial', function () {
    assert.isTrue(shouldAutoShowTutorial({ profile: {} }));
  });

  it('returns true for a user with no profile', function () {
    assert.isTrue(shouldAutoShowTutorial({}));
  });

  it('returns true when hasSeenTutorial is explicitly false', function () {
    assert.isTrue(shouldAutoShowTutorial({ profile: { hasSeenTutorial: false } }));
  });

  it('returns false for a user who has seen the tutorial', function () {
    assert.isFalse(shouldAutoShowTutorial({ profile: { hasSeenTutorial: true } }));
  });

  it('returns false when there is no user', function () {
    assert.isFalse(shouldAutoShowTutorial(null));
    assert.isFalse(shouldAutoShowTutorial(undefined));
  });
});
