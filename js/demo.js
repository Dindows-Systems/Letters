// ----------------------------------------------------------------------------
// All right reserved
// Copyright (C) 2012 Jay Salvat
// http://jaysalvat.com/
// ----------------------------------------------------------------------------

buzz.defaults.formats = [ 'ogg', 'mp3' ];
buzz.defaults.preload = 'metadata';

var games = [
    { img: 'img/letters.png', color:'#7FA917', word: 'letters !', sound: 'sounds/truck' },
    { img: 'img/letter_a.png', color:'#BCC9CC', word: 'a', sound: 'sounds/a' },
	{ img: 'img/letter_b.png', color:'#BCC9CC', word: 'b', sound: 'sounds/b' },
    { img: 'img/letter_c.png', color:'#BCC9CC', word: 'c', sound: 'sounds/c' },
	{ img: 'img/letter_d.png', color:'#BCC9CC', word: 'd', sound: 'sounds/d' },
	{ img: 'img/letter_e.png', color:'#BCC9CC', word: 'e', sound: 'sounds/e' },
	{ img: 'img/letter_f.png', color:'#BCC9CC', word: 'f', sound: 'sounds/f' },
	{ img: 'img/letter_g.png', color:'#BCC9CC', word: 'g', sound: 'sounds/g' },
	{ img: 'img/letter_h.png', color:'#BCC9CC', word: 'h', sound: 'sounds/h' },
	{ img: 'img/letter_i.png', color:'#BCC9CC', word: 'i', sound: 'sounds/i' },
	{ img: 'img/letter_j.png', color:'#BCC9CC', word: 'j', sound: 'sounds/j' },
	{ img: 'img/letter_k.png', color:'#BCC9CC', word: 'k', sound: 'sounds/k' },
	{ img: 'img/letter_l.png', color:'#BCC9CC', word: 'l', sound: 'sounds/l' },
	{ img: 'img/letter_m.png', color:'#BCC9CC', word: 'm', sound: 'sounds/m' },
	{ img: 'img/letter_n.png', color:'#BCC9CC', word: 'n', sound: 'sounds/n' },
	{ img: 'img/letter_o.png', color:'#BCC9CC', word: 'o', sound: 'sounds/o' },
	{ img: 'img/letter_p.png', color:'#BCC9CC', word: 'p', sound: 'sounds/p' },
	{ img: 'img/letter_q.png', color:'#BCC9CC', word: 'q', sound: 'sounds/q' },
	{ img: 'img/letter_r.png', color:'#BCC9CC', word: 'r', sound: 'sounds/r' },
	{ img: 'img/letter_s.png', color:'#BCC9CC', word: 's', sound: 'sounds/s' },
	{ img: 'img/letter_t.png', color:'#BCC9CC', word: 't', sound: 'sounds/t' },
	{ img: 'img/letter_u.png', color:'#BCC9CC', word: 'u', sound: 'sounds/u' },
	{ img: 'img/letter_v.png', color:'#BCC9CC', word: 'v', sound: 'sounds/v' },
	{ img: 'img/letter_w.png', color:'#BCC9CC', word: 'w', sound: 'sounds/w' },
	{ img: 'img/letter_x.png', color:'#BCC9CC', word: 'x', sound: 'sounds/x' },
	{ img: 'img/letter_y.png', color:'#BCC9CC', word: 'y', sound: 'sounds/y' },
	{ img: 'img/letter_z.png', color:'#BCC9CC', word: 'z', sound: 'sounds/z' },
    { img: 'img/end.png', color:'#FFBE00', word: '', sound: 'sounds/truck' }
];

var winSound        = new buzz.sound('sounds/win' ),
    errorSound      = new buzz.sound('sounds/error' ),
    alphabetSounds  = {},
    alphabet        = 'abcdefghijklmnopqrstuvwxyz'.split( '' );

for( var i in alphabet ) {
    var letter = alphabet[ i ];
    alphabetSounds[ letter ] = new buzz.sound('sounds/kid/'+ letter );
}

$( function() {
    if ( !buzz.isSupported() ) {
        $('#warning').show();
    }

    var idx = 0,
        $container  = $( '#container' ),
        $picture    = $( '#picture' ),
        $models     = $( '#models' ),
        $letters    = $( '#letters' );

    $( 'body' ).bind('selectstart', function() { 
        return false 
    });

    $( '#next' ).click( function() {
        refreshGame();
        buildGame( ++idx ); 
        return false;
    });

    $( '#previous' ).click( function() {
       refreshGame();
       buildGame( --idx ); 
       return false;
    });

    $( '#level' ).click( function() {
        if ( $( this ).text() == 'easy' ) {
            $( this ).text( 'hard' );
            $models.addClass( 'hard' );
        } else {
            $( this ).text( 'easy' );
            $models.removeClass( 'hard' );
        }
        return false;
    });

    function refreshGame() {
        $( '#models' ).html( '' );
        $( '#letters' ).html( '' );
    }

    function buildGame( x ) {
        if ( x > games.length - 1 ) {
            idx = 0;
        }
        if ( x < 0 ) {
            idx = games.length - 1;
        }

        var game  = games[ idx ],
            score = 0;

        var gameSound = new buzz.sound( game.sound );
        gameSound.play();

        // Fade the background color
        $( 'body' ).stop().animate({
            backgroundColor: game.color
        }, 1000);
        $( '#header a' ).stop().animate({
            color: game.color
        }, 1000);

        // Update the picture
        $picture.attr( 'src', game.img )
            .unbind( 'click' )
            .bind( 'click', function() {
                gameSound.play();
            });

        // Build model
        var modelLetters = game.word.split( '' );

        for( var i in modelLetters ) {
            var letter = modelLetters[ i ];
            $models.append( '<li>' + letter + '</li>' );
        }

        var letterWidth = $models.find( 'li' ).outerWidth( true );

        $models.width( letterWidth * $models.find( 'li' ).length );

        // Build shuffled letters
        var letters  = game.word.split( '' ),
            shuffled = letters.sort( function() { return Math.random() < 0.5 ? -1 : 1 });

        for( var i in shuffled ) {
            $letters.append( '<li class="draggable">' + shuffled[ i ] + '</li>' );
        }

        $letters.find( 'li' ).each( function( i ) {
            var top   = ( $models.position().top ) + ( Math.random() * 100 ) + 80,
                left  = ( $models.offset().left - $container.offset().left ) + ( Math.random() * 20 ) + ( i * letterWidth ),
                angle = ( Math.random() * 30 ) - 10;

            $( this ).css({
                top:  top  + 'px',
                left: left + 'px'
            });

            rotate( this, angle );

            $( this ).mousedown( function() {
                var letter = $( this ).text();
                if ( alphabetSounds[ letter ] ) {
                    alphabetSounds[ letter ].play();
                }
            });
        });

        $letters.find( 'li.draggable' ).draggable({
            zIndex: 9999,
            stack: '#letters li'
        });

        $models.find( 'li' ).droppable( {
            accept:     '.draggable',
            hoverClass: 'hover',
            drop: function( e, ui ) {
                var modelLetter      = $( this ).text(),
                    droppedLetter = ui.helper.text();

                if ( modelLetter == droppedLetter ) {
                    ui.draggable.animate( {
                        top:     $( this ).position().top,
                        left:     $( this ).position().left
                    } ).removeClass( 'draggable' ).draggable( 'option', 'disabled', true );
                    
                    rotate( ui.draggable, 0 );
                    
                    score++;
                    
                    if ( score == modelLetters.length ) {
                        winGame();
                    }    
                } else {
                    ui.draggable.draggable( 'option', 'revert', true );
                    
                    errorSound.play();
                    
                    setTimeout( function() {
                        ui.draggable.draggable( 'option', 'revert', false );
                    }, 100 );
                }
            }
        });
    }

    function winGame() {
        winSound.play();

        $( '#letters li' ).each( function( i ) {
            var $$ = $( this );
            setTimeout( function() {
                $$.animate({
                    top:'+=60px'
                });
            }, i * 300 );
        });

        setTimeout( function() {
            refreshGame();
            buildGame( ++idx );
        }, 3000);
    }

    function rotate( el, angle ) {
        $( el ).css({
            '-webkit-transform': 'rotate(' + angle + 'deg)',
            '-moz-transform': 'rotate(' + angle + 'deg)',
            '-ms-transform': 'rotate(' + angle + 'deg)',
            '-o-transform': 'rotate(' + angle + 'deg)',
            'transform': 'rotate(' + angle + 'deg)'
        });
    }

    buildGame( idx );
});