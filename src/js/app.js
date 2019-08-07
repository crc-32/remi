/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Voice = require('ui/voice');
var Vibe = require('ui/vibe');
var Settings = require('settings');
var ajax = require('ajax');

const statusDef = {separator: 'none', color: 'white', backgroundColor: 'black'};

Settings.config(
  { url: 'https://assist.crc32.dev/config.html' },
  function(e) {
    console.log('opening configurable');
  },
  function(e) {
    console.log('closed configurable');
  }
);

function dictate()
{
  Voice.dictate('start', true, function(e) {
    if (e.err) {
      var card = new UI.Card({
        title: 'Error',
        body: data,
        scrollable: true,
        status: statusDef
      });
      card.show();
    }

    ajax({
        url: encodeURI(`https://assist.crc32.dev/assist/?query=${e.transcription}&clientid=${Settings.option('clientid')}&clientsecret=${Settings.option('clientsecret')}&clientrefresh=${Settings.option('clientrefresh')}`),
        method: 'GET',
        type: undefined,
        headers: {
        }
      },
      function(data, status, request) {
        var card = new UI.Card({
          title: 'Assistant',
          body: data,
          scrollable: true,
          status: statusDef,
          style: 'large'
        });
        card.on('click', 'select', dictate);
        Vibe.vibrate('short');
        card.show();
      },
      function(error, status, request) {
        var card = new UI.Card({
          title: 'Error',
          body: 'Error occured while processing, check your internet!\n' + status,
          scrollable: true,
          status: statusDef
        });
        Vibe.vibrate('short');
        card.show();
      }
    );

  });
}

var main = new UI.Card({
  title: 'Remi',
  body: 'Press select to dictate',
  status: statusDef
});

main.on('click', 'select', dictate);
main.show();