function Game(mainCanvas, bgCanvas) {
  this.surface = mainCanvas.getContext('2d');
  this.surface.fillStyle = 'white';

  this.bgGl = bgCanvas.getContext('webgl');
  this.bgGl.clearColor(0.0, 0.0, 0.0, 1.0);

//  this.width = Number(mainCanvas.getAttribute('width')) - Game._SIDE_WIDTH;
  this.width = Number(mainCanvas.getAttribute('width'));
  this.height = Number(mainCanvas.getAttribute('height'));
  this.sounds = [ ] ;
  this.bgms = [ ] ;
  this.images = [ ] ;

  this.interval = null ;
  this.oldTIme = null ;
  this.fps = null ;
  this.count = 0 ;

  this.state = 0 ;
  this.flags = 0 ;

  this.states = [ ] ; // TODO: temporal
  this.states[ Game._STATE_LOAD ]        = new LoadingState( this ) ;
  this.states[ Game._STATE_OPENING ]     = new OpeningState( this ) ;
  this.states[ Game._STATE_CHARA_SEL ]   = new CharacterSelectState( this ) ;
  this.states[ Game._STATE_REPLAY_SEL ]  = new ReplaySelectState( this ) ;
  this.states[ Game._STATE_IN_STAGE ]    = new StageState( this ) ;
  this.states[ Game._STATE_ENDING ]      = new EndingState( this ) ;
  this.states[ Game._STATE_STAFF_ROLL ]  = new StaffRollState( this ) ;
  this.states[ Game._STATE_POST_REPLAY ] = new PostReplayState( this ) ;

  this._changeState( Game._STATE_LOAD, { } ) ;

}

Game._SIDE_WIDTH = 160 ;
Game._FPS = 60 ;
Game._FPS_SPAN = 60 ;

Game._STATE_LOAD        = 0x0 ;
Game._STATE_OPENING     = 0x1 ;
Game._STATE_CHARA_SEL   = 0x2 ;
Game._STATE_REPLAY_SEL  = 0x3 ;
Game._STATE_IN_STAGE    = 0x4 ;
Game._STATE_STAGE_CLEAR = 0x5 ;
Game._STATE_ENDING      = 0x6 ;
Game._STATE_STAFF_ROLL  = 0x7 ;
Game._STATE_POST_REPLAY = 0x8 ;

Game._SE_SELECT       = 0 ;
Game._SE_DEAD         = 1 ;
Game._SE_SHOT         = 2 ;
Game._SE_ENEMY_SHOT   = 3 ;
Game._SE_ENEMY_VANISH = 4 ;
Game._SE_ENEMY_DAMAGE = 5 ;
Game._SE_GRAZE        = 6 ;
Game._SE_POWERUP      = 7 ;
Game._SE_POWER_EFFECT = 8 ;

Game._IMG_REIMU_SHIP      =  0 ;
Game._IMG_MARISA_SHIP     =  1 ;
Game._IMG_REIMU_OPTION    =  2 ;
Game._IMG_MARISA_OPTION   =  3 ;
Game._IMG_SHOT            =  4 ;
Game._IMG_BOMB            =  5 ;
Game._IMG_ENEMY_SHOT      =  6 ;
Game._IMG_LASER           =  7 ;
Game._IMG_BEAM            =  8 ;
Game._IMG_ENEMY           =  9 ;
Game._IMG_DAMAGE          = 10 ;
Game._IMG_VANISHED        = 11 ;
Game._IMG_SHOCK_WAVE      = 12 ;
Game._IMG_REIMU_FACE_1    = 13 ;
Game._IMG_REIMU_FACE_2    = 14 ;
Game._IMG_REIMU_FACE_3    = 15 ;
Game._IMG_REIMU_FACE_4    = 16 ;
Game._IMG_MARISA_FACE_1   = 17 ;
Game._IMG_MARISA_FACE_2   = 18 ;
Game._IMG_MARISA_FACE_3   = 19 ;
Game._IMG_MARISA_FACE_4   = 20 ;
Game._IMG_ENEMY_MOKOU     = 21 ;
Game._IMG_ENEMY_RUMIA     = 22 ;
Game._IMG_ENEMY_DAIYOUSEI = 23 ;
Game._IMG_ENEMY_CHILNO    = 24 ;
Game._IMG_POWER_ITEM      = 25 ;
Game._IMG_SCORE_ITEM      = 26 ;
Game._IMG_BG1             = 27 ;
Game._IMG_BG2             = 28 ;
Game._IMG_SCORE_BACK      = 29 ;
Game._IMG_STAND_REIMU     = 30 ;
Game._IMG_STAND_MARISA    = 31 ;
Game._IMG_STAND_MOKOU     = 32 ;
Game._IMG_STAND_RUMIA     = 33 ;
Game._IMG_STAND_CHILNO    = 34 ;
Game._IMG_TITLE_BG        = 35 ;

Game._IMGS = { } ;
Game._IMGS[ Game._IMG_REIMU_SHIP ]       = 'image/reimu.png' ;
Game._IMGS[ Game._IMG_MARISA_SHIP ]      = 'image/marisa.png' ;
Game._IMGS[ Game._IMG_REIMU_OPTION ]     = 'image/reimu_option.png' ;
Game._IMGS[ Game._IMG_MARISA_OPTION ]    = 'image/marisa_option.png' ;
Game._IMGS[ Game._IMG_SHOT ]             = 'image/pl_shot.png' ;
Game._IMGS[ Game._IMG_BOMB ]             = 'image/th128_Bullet2HD.png' ;
Game._IMGS[ Game._IMG_ENEMY_SHOT ]       = 'image/bullet.png' ;
Game._IMGS[ Game._IMG_LASER ]            = 'image/pl_shot.png' ;
Game._IMGS[ Game._IMG_BEAM ]             = 'image/beam.png' ;
Game._IMGS[ Game._IMG_ENEMY ]            = 'image/enemy.png' ;
Game._IMGS[ Game._IMG_ENEMY_MOKOU ]      = 'image/mokou.png' ;
Game._IMGS[ Game._IMG_ENEMY_RUMIA ]      = 'image/rumia.png' ;
Game._IMGS[ Game._IMG_ENEMY_DAIYOUSEI ]  = 'image/daiyousei.png' ;
Game._IMGS[ Game._IMG_ENEMY_CHILNO ]     = 'image/chilno.png' ;
Game._IMGS[ Game._IMG_DAMAGE ]           = 'image/th128_BulletHD.png' ;
Game._IMGS[ Game._IMG_VANISHED ]         = 'image/th128_Bullet2.png' ;
Game._IMGS[ Game._IMG_SHOCK_WAVE ]       = 'image/shockwave.png' ;
Game._IMGS[ Game._IMG_REIMU_FACE_1 ]     = 'image/reimu_1.png' ;
Game._IMGS[ Game._IMG_REIMU_FACE_2 ]     = 'image/reimu_2.png' ;
Game._IMGS[ Game._IMG_REIMU_FACE_3 ]     = 'image/reimu_3.png' ;
Game._IMGS[ Game._IMG_REIMU_FACE_4 ]     = 'image/reimu_4.png' ;
Game._IMGS[ Game._IMG_MARISA_FACE_1 ]    = 'image/marisa_1.png' ;
Game._IMGS[ Game._IMG_MARISA_FACE_2 ]    = 'image/marisa_2.png' ;
Game._IMGS[ Game._IMG_MARISA_FACE_3 ]    = 'image/marisa_3.png' ;
Game._IMGS[ Game._IMG_MARISA_FACE_4 ]    = 'image/marisa_4.png' ;
Game._IMGS[ Game._IMG_POWER_ITEM ]       = 'image/power_item.png' ;
Game._IMGS[ Game._IMG_SCORE_ITEM ]       = 'image/score_item.png' ;
Game._IMGS[ Game._IMG_BG1 ]              = 'image/bg1.png' ;
Game._IMGS[ Game._IMG_BG2 ]              = 'image/bg2.png' ;
Game._IMGS[ Game._IMG_SCORE_BACK ]       = 'image/scoreback.png' ;
Game._IMGS[ Game._IMG_STAND_REIMU ]      = 'image/reimu_stand.png' ;
Game._IMGS[ Game._IMG_STAND_MARISA ]     = 'image/marisa_stand.png' ;
Game._IMGS[ Game._IMG_STAND_MOKOU ]      = 'image/mokou_stand.png' ;
Game._IMGS[ Game._IMG_STAND_RUMIA ]      = 'image/rumia_stand.png' ;
Game._IMGS[ Game._IMG_STAND_CHILNO ]     = 'image/chilno_stand.png' ;
Game._IMGS[ Game._IMG_TITLE_BG ]         = 'image/title_bg.png' ;

Game._BGM_TITLE  = 0 ;
Game._BGM_1      = 1 ;
Game._BGM_ENDING = 2 ;

Game._BGMS = { } ;
Game._BGMS[ Game._BGM_TITLE ]  = 'BGM/title.mp3' ;
Game._BGMS[ Game._BGM_1 ]      = 'BGM/bgm.mp3' ;
Game._BGMS[ Game._BGM_ENDING ] = 'BGM/ending.mp3' ;

Game._SES = { } ;
Game._SES[ Game._SE_SELECT ]       = 'SE/select.wav' ;
Game._SES[ Game._SE_DEAD ]         = 'SE/dead.wav' ;
Game._SES[ Game._SE_SHOT ]         = 'SE/shot.wav' ;
Game._SES[ Game._SE_ENEMY_SHOT ]   = 'SE/shot.wav' ;
Game._SES[ Game._SE_ENEMY_VANISH ] = 'SE/enemy_vanish.wav' ;
Game._SES[ Game._SE_ENEMY_DAMAGE ] = 'SE/enemy_damage.wav' ;
Game._SES[ Game._SE_GRAZE ]        = 'SE/graze.wav' ;
Game._SES[ Game._SE_POWERUP ]      = 'SE/powerup.wav' ;
Game._SES[ Game._SE_POWER_EFFECT ] = 'SE/enemy_powereffect.wav' ;


Game.prototype.getImage = function( key ) {
  return this.images[ key ] ;
} ;


/**
 * TODO: temporal
 */
Game.prototype.soundEffect = function( key ) {
  if( key == Game._SE_SHOT )
    this.sounds[ key ].volume = 0.012 ;
  else if( key == Game._SE_SELECT )
    this.sounds[ key ].volume = 0.04 ;
  else if( key == Game._SE_POWER_EFFECT )
    this.sounds[ key ].volume = 0.14 ;
  else if( key == Game._SE_ENEMY_SHOT )
    this.sounds[ key ].volume = 0.02 ;
  else if( key == Game._SE_ENEMY_DAMAGE )
    this.sounds[ key ].volume = 0.014 ;
  else if( key == Game._SE_ENEMY_VANISH )
    this.sounds[ key ].volume = 0.03 ;
  else if( key == Game._SE_DEAD )
    this.sounds[ key ].volume = 0.05 ;
  else if( key == Game._SE_POWERUP )
    this.sounds[ key ].volume = 0.04 ;
  else if( key == Game._SE_GRAZE )
    this.sounds[ key ].volume = 0.05 ;
  else
    this.sounds[ key ].volume = 0.1 ;
  this.sounds[ key ].pause( ) ;
  this.sounds[ key ].currentTime = 0 ;
  this.sounds[ key ].play( ) ;
//  this.sounds[ key ] = new Audio( this.sounds[ key ].src ) ;
} ;


Game.prototype.soundBGM = function( key ) {

  for( var i = 0; i < this.bgms.length; i++ ) {
    this.bgms[ i ].pause( ) ;
    this.bgms[ i ].currentTime = 0 ;
  }

  this.bgms[ key ].loop = true ;
  // TODO: temporal
  if( key == Game._BGM_TITLE )
    this.bgms[ key ].volume = 0.08 ;
  else
    this.bgms[ key ].volume = 0.2 ;
  this.bgms[ key ].play( ) ;
} ;


Game.prototype.run = function( ) {
  this.states[ this.state ].init( ) ;
//  this.interval = setInterval( this._runStep.bind( this ), 1000 / Game._FPS ) ;
  this._runStep( ) ;
} ;


Game.prototype.clear = function( surface ) {
  surface.clearRect( 0, 0, this.width, this.height ) ;
} ;


Game.prototype.handleKeyDown = function( e ) {
  this.states[ this.state ].handleKeyDown( e ) ;
  e.preventDefault( ) ;
} ;


Game.prototype.handleKeyUp = function( e ) {
  this.states[ this.state ].handleKeyUp( e ) ;
  e.preventDefault( ) ;
} ;


/**
 * TODO: temporal
 */
Game.prototype._runStep = function( ) {
  this.states[ this.state ].runStep( ) ;
  this.states[ this.state ].updateDisplay( this.surface ) ;
  this._displayFps( this.surface ) ;
  this.count++ ;
  requestAnimationFrame( this._runStep.bind( this ) ) ;
} ;


Game.prototype._calculateFps = function( ) {
  if( ( this.count % Game._FPS_SPAN ) != 0 )
    return ;
  var newTime = Date.now( ) ;
  if( this.oldTime ) {
    this.fps = parseInt( 1000 * Game._FPS_SPAN / ( newTime - this.oldTime ) ) ;
  }
  this.oldTime = newTime ;
} ;


Game.prototype._displayFps = function( surface ) {
  this._calculateFps( ) ;
  if( ! this.fps )
    return ;

  surface.save( ) ;
  surface.shadowColor = 'rgb( 255, 255, 255 )' ;
  surface.font = '16px Arial' ;
  surface.fillText( this.fps + 'fps', this.getWidth( ) - 50, this.getHeight( ) - 15 ) ;
  surface.restore( ) ;
} ;


Game.prototype.notifyLoadingConclusion = function( ) {
  this._changeState( Game._STATE_OPENING, { } ) ;
//  this._changeState( Game._STATE_STAFF_ROLL, { } ) ;
} ;


Game.prototype.notifyOpeningConclusion = function( ) {
  this._changeState( Game._STATE_CHARA_SEL, { } ) ;
} ;


Game.prototype.notifyCharacterSelectConclusion = function( index ) {
  this._changeState( Game._STATE_IN_STAGE,
                     { 'characterIndex': index } ) ;
} ;


Game.prototype.notifyReplaySelectBegin = function( index ) {
  this._changeState( Game._STATE_REPLAY_SEL, { } ) ;
} ;


/**
 * TODO: temporal
 */
Game.prototype.notifyReplaySelectConclusion = function( params ) {
  // currently, only Reimu.
  this._changeState( Game._STATE_IN_STAGE,
                     { 'autoplayParams': params, 'autoplay': true } ) ;
} ;


/**
 * TODO: temporal
 */
Game.prototype.notifyQuitStage = function( flag ) {
  if( flag )
    this._changeState( Game._STATE_POST_REPLAY, { } ) ;
  else
    this._changeState( Game._STATE_OPENING, { } ) ;
} ;


Game.prototype.notifyGameClear = function( ) {
//  this._changeState( Game._STATE_ENDING, { } ) ;
  this._changeState( Game._STATE_STAFF_ROLL, { } ) ;
} ;


Game.prototype._changeState = function( state, params ) {
  this.state = state ;
  this.states[ this.state ].init( params ) ;
} ;


Game.prototype.getWidth = function( ) {
  return this.width ;
} ;


Game.prototype.getHeight = function( ) {
  return this.height ;
} ;


Game.prototype.isFlagSet = function( type ) {
  return ( this.flags & type ) ? true : false ;
} ;


Game.prototype.setFlag = function( type ) {
  this.flags |= type ;
} ;


Game.prototype.clearFlag = function( type ) {
  this.flags &= ~type ;
} ;
