describe('QuickBlox SDK - Messages', function() {
  var quickBlox = QB;

  beforeEach(function(){
    var done;
    runs(function(){
      quickBlox.init(CONFIG);
      done = false;
      quickBlox.createSession({login: VALID_USER, password: VALID_PASSWORD},function (err, result){
        expect(err).toBeNull();
        expect(result).not.toBeNull();
        done = true;
      });
    });
    waitsFor(function(){
      return done;
      },'create session', TIMEOUT);
  });

  describe('Tokens', function(){
    var pushToken;
    it('can create a push token', function(){
      var done;
      runs(function(){
        done = false;
        params = {environment: 'production', client_identification_sequence: 'aa557232bc237245ba67686484efab', platform: 'iOS', udid: '5f5930e927660e6e7d8ff0548b3c404a4d16c04f'};
        quickBlox.messages().createPushToken(params, function(err, res){
          pushToken = res;
          done = true;
          expect(err).toBeNull();
        });
      });
      waitsFor(function(){
        return done;
      },'create push token', TIMEOUT);
      runs(function(){
        expect(pushToken).not.toBeNull();
        expect(pushToken.id).toBeGreaterThan(0);
      });
    });

    it('can delete a push token', function(){
      var done;
      runs(function(){
        done = false;
        expect(pushToken).not.toBeNull();
        quickBlox.messages().deletePushToken(pushToken.id, function(err, res){
          expect(err).toBeNull();
          done = true;
        });
      });
      waitsFor(function(){
        return done;
      },'delete push token', TIMEOUT);
    });
  });

  describe('Subscriptions', function(){
    var subscription;
    it('can create a subscription', function(){
      var done;
      runs(function(){
      done = false;
        params = { notification_channels : 'pull ', url: 'http://example.com/notify_me'};
        quickBlox.messages().createSubscription(params, function(err, res){
          subscription = res;
          done = true;
          expect(err).toBeNull();
        });
      });
      waitsFor(function(){
        return done;
      },'create subscription', TIMEOUT);
      runs(function(){
        expect(subscription).not.toBeNull();
        expect(subscription.token).not.toBeNull();
      });
    });

    it('can list subscriptions', function(){
      var done, result;
      runs(function(){
      done = false;
        quickBlox.messages().listSubscriptions(function(err, res){
          result = res;
          done = true;
          expect(err).toBeNull();
        });
      });
      waitsFor(function(){
        return done;
      },'list subscriptions', TIMEOUT);
      runs(function(){
        console.debug('subscriptions',result);
        expect(result).not.toBeNull();
        expect(result.length).not.toBeNull();
      });
    });

    it('can delete subscription', function(){
      var done, error;
      runs(function(){
      done = false;
        quickBlox.messages().deleteSubscription(subscription.id, function(err, res){
          error = err;
          done = true;
        });
      });
      waitsFor(function(){
        return done;
      },'delete subscription', TIMEOUT);
      runs(function(){
        expect(error).toBeNull();
      });
    });
  });


  describe('Events', function(){
    it('can create a pull event', function(){
      var done, result;
      runs(function(){
      done = false;
        params = {notification_type: 'pull', environment:'production', message: window.btoa('QuickBlox JavaScript SDK Spec Event'),
            user: { id : [239647, 245530]},
            end_date:  Math.floor((Date.now() / 1000) +(24*60*60)).toString()};
        quickBlox.messages().createEvent(params, function(err, res){
          result = res;
          done = true;
          expect(err).toBeNull();
        });
      });
      waitsFor(function(){
        return done;
      },'create pull event', TIMEOUT * 3);
      runs(function(){
        expect(result).not.toBeNull();
        expect(result.token).not.toBeNull();
      });
    });

    it('can get pull events', function(){
      var done, result;
      runs(function(){
      done = false;
        quickBlox.messages().listPullEvents(function(err, res){
          result = res;
          done = true;
          expect(err).toBeNull();
        });
      });
      waitsFor(function(){
        return done;
      },'get pull events', TIMEOUT * 3);
      runs(function(){
        expect(result).not.toBeNull();
        expect(result.length).not.toBeNull();
      });
    });
  });

});

