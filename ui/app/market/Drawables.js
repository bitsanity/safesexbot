const TWOPI = 2.0 * Math.PI;

class Point {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

class MBR {
  constructor( minx, miny, maxx, maxy ) {
    this.minx = minx;
    this.miny = miny;
    this.maxx = maxx;
    this.maxy = maxy;
  }

  includes( p ) {
    return (    p.x > this.minx && p.x < this.maxx
             && p.y > this.miny && p.y < this.maxy );
  }
}

class Drawables {

  static drawThese( ctx, ds ) {
    for (let ii = 0; ii < ds.length; ii++)
      ds[ii].draw( ctx );
  }

  static minX( parr ) {
    let result = parr[0].x;
    for( let ii = 1; ii < parr.length; ii++ )
      if (parr[ii].x < result) result = parr[ii].x;
    return result;
  }
  static maxX( parr ) {
    let result = parr[0].x;
    for( let ii = 1; ii < parr.length; ii++ )
      if (parr[ii].x > result) result = parr[ii].x;
    return result;
  }
  static minY( parr ) {
    let result = parr[0].y;
    for( let ii = 1; ii < parr.length; ii++ )
      if (parr[ii].y < result) result = parr[ii].y;
    return result;
  }
  static maxY( parr ) {
    let result = parr[0].y;
    for( let ii = 1; ii < parr.length; ii++ )
      if (parr[ii].y > result) result = parr[ii].y;
    return result;
  }
}

class Drawable {

  constructor( fc, sc ) {
    this.fillcol = fc;
    this.strcol = sc;
  }

  draw( ctx ) {
    throw "Must override";
  }

  drawPath( ctx ) {
    if (this.fillcol) {
      ctx.fillStyle = this.fillcol;
      ctx.fill();
    }
    if (this.strcol) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.strcol;
      ctx.stroke();
    }
  }

  includes( p ) {
    if (!this.mbr) return false;
    return this.mbr.includes( p );
  }
}

class Polyline extends Drawable {
  pts;

  constructor( pts, fillcol, strcol ) {
    super( fillcol, strcol );
    this.pts = pts;
    this.mbr = new MBR( Drawables.minX(pts), Drawables.minY(pts),
                        Drawables.maxX(pts), Drawables.maxY(pts) );
  }
  draw( ctx ) {
    ctx.beginPath();
    ctx.moveTo( this.pts[0].x, this.pts[0].y );

    for (let ii = 1; ii < this.pts.length; ii++)
      ctx.lineTo( this.pts[ii].x, this.pts[ii].y );

    super.drawPath( ctx, null, this.strcol );
  }
}

class Rectangle extends Drawable {
  home;
  w;
  h;
  constructor( home, w, h, fc, sc ) {
    super( fc, sc );
    this.home = home;
    this.w = w;
    this.h = h;
    this.mbr = new MBR( home.x, home.y, home.x + w, home.y + h );
  }

  draw( ctx ) {
    if (this.fillcol) {
      ctx.fillStyle = this.fillcol;
      ctx.fillRect( this.home.x, this.home.y, this.w, this.h );
    }
    if (this.strcol) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.strcol;
      ctx.strokeRect( this.home.x, this.home.y, this.w, this.h );
    }
  }
}

class Circle extends Drawable {
  c;
  r;
  constructor( c, r, fc, sc ) {
    super( fc, sc );
    this.c = c;
    this.r = r;

    // much faster than calculating dist to c and testing against r
    this.mbr = new MBR( c.x - r/2, c.y - r/2, c.x + r/2, c.y + r/2 );
  }
  draw( ctx ) {
    if (this.fillcol) {
      ctx.beginPath();
      ctx.fillStyle = this.fillcol;
      ctx.arc( this.c.x, this.c.y, this.r, 0, TWOPI );
      ctx.fill();
    }
    if (this.strcol) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.arc( this.c.x, this.c.y, this.r, 0, TWOPI );
      ctx.strokeStyle = this.strcol;
      ctx.stroke();
    }
  }
}

class Text extends Drawable {
  font;
  home;
  val;

  constructor( f, h, val, fc, sc ) {
    super( fc, sc );
    this.font = f;
    this.home = h;
    this.val = val;
  }

  draw( ctx ) {
    ctx.font = this.font;

    if (this.fillcol) {
      ctx.fillStyle = this.fillcol;
      ctx.fillText( this.val, this.home.x, this.home.y );
    }
    if (this.strcol) {
      ctx.strokeStyle = this.strcol;
      ctx.strokeText( this.val, this.home.x, this.home.y );
    }
  }
}

class RoundedRect extends Drawable {
  pts;
  rc; // round of corner

  constructor( width, height, rc, fc, sc ) {
    super( fc, sc );
    this.rc = rc;

    this.pts = [ new Point( rc, 0 ), new Point( width-rc, 0 ),
                 new Point( width, rc ), new Point( width, height-rc ),
                 new Point( width-rc, height ), new Point( rc, height ),
                 new Point( 0, height-rc ), new Point( 0, rc ) ]; 

    this.mbr = new MBR( Drawables.minX(this.pts), Drawables.minY(this.pts),
                        Drawables.maxX(this.pts), Drawables.maxY(this.pts) );
  }

  drawBase( ctx ) {
    ctx.beginPath();
    ctx.moveTo( this.pts[0].x, this.pts[0].y );
    ctx.lineTo( this.pts[1].x, this.pts[1].y );
    ctx.arcTo( this.pts[2].x, this.pts[1].y,
               this.pts[2].x, this.pts[2].y, this.rc );
    ctx.lineTo( this.pts[3].x, this.pts[3].y );
    ctx.arcTo( this.pts[3].x, this.pts[4].y,
               this.pts[4].x, this.pts[4].y, this.rc );
    ctx.lineTo( this.pts[5].x, this.pts[5].y );
    ctx.arcTo( this.pts[6].x, this.pts[5].y,
               this.pts[6].x, this.pts[6].y, this.rc );
    ctx.lineTo( this.pts[7].x, this.pts[7].y );
    ctx.arcTo( this.pts[7].x, this.pts[0].y,
               this.pts[0].x, this.pts[0].y, this.rc );

    super.drawPath( ctx );
  }

  draw( ctx ) {
    this.drawBase( ctx );
  }
}

class Polygon extends Drawable {
  pts;

  constructor( pts, fc, sc ) {
    super( fc, sc );
    this.pts = pts;

    // again for speed, assuming polygons in our sim are sanely shaped
    this.mbr = new MBR( Drawables.minX(pts), Drawables.minY(pts),
                        Drawables.maxX(pts), Drawables.maxY(pts) );
  }

  draw( ctx ) {
    ctx.beginPath();
    ctx.moveTo( this.pts[0].x, this.pts[0].y );

    for (let ii = 1; ii < this.pts.length; ii++) {
      ctx.lineTo( this.pts[ii].x, this.pts[ii].y );
    }

    super.drawPath( ctx );
  }
}

