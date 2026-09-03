/*
 * PixInsight version 1.8.9-3

   TypeCat

   A catalog creator for the use with Annotation.js


   Purpose:

      If one or more object types are required for an image analysis,
      TypeCat can create the list of existing objects for the
      Annotation script. TypeCat searches for all occurrences
      of an object type and collects the results in a file.

      For example, if all infrared sources, carbon stars and quasars
      are to be identified, the search terms IR, C * and QSO must be
      entered one after the other.

      The saved custom-catalog formatted file is then used in the
      annotation script.

   How:

      Choose an object type from the upper table and type the name into
      the textbox labled 'ObjectType:'. If you don't know the correct
      name, scroll the top table and click the appropriate row,
      which transfers the name into the textbox.

      A correct name releases the download toolbutton to the right of
      the textbox. Now download the list of objects.

      If you need more objecttypes, repeat this process.

      Save the complete list.

   Options:

      Max. download limits the number of datarows.

      Add to Annotation checked updates the Annotation settings with
      the filename after successful save.

      The button Delete removes the file and clears the Annotation
      settings for this name.

   Hints:

      Objects retrieved from download  (cone search) are limited by
      the image frame. This explains the differences between the console
      log and the count field.

      For details on any object in the table, double click a row and
      follow the Simbad browser window.


   Reference:

         https://simbad.u-strasbg.fr/simbad/sim-display?data=otypes

         https://cds.u-strasbg.fr/vizier-org/licences_vizier.html



*/

#define ID "TypeCat"

#include <pjsr/StdButton.jsh>
#include <pjsr/FrameStyle.jsh>
#include <pjsr/TextAlign.jsh>
#include <pjsr/NumericControl.jsh>
#include <pjsr/Sizer.jsh>
#include <pjsr/Slider.jsh>
#include <pjsr/UndoFlag.jsh>
#include <pjsr/SampleType.jsh>
#include <pjsr/DataType.jsh>
#include <pjsr/Color.jsh>
#include <pjsr/FileMode.jsh>
#include <pjsr/StdIcon.jsh>
#include <pjsr/StdCursor.jsh>

#feature-id  Utilities > TypeCat

#define TITLE              "ObjectType Catalog"
#define VERSION            "1.2.2"


var server = "http://simbad.u-strasbg.fr/";


var OBJTYPES =
[{"cond":"?","extd":"Object of unknown nature"},
{"cond":"ev","extd":"transient event"},
{"cond":"","extd":""},
{"cond":"Rad","extd":"Radio-source"},
{"cond":"mR","extd":"metric Radio-source"},
{"cond":"cm","extd":"centimetric Radio-source"},
{"cond":"mm","extd":"millimetric Radio-source"},
{"cond":"smm","extd":"sub-millimetric source"},
{"cond":"HI","extd":"HI (21cm) source"},
{"cond":"rB","extd":"radio Burst"},
{"cond":"Mas","extd":"Maser"},
{"cond":"","extd":""},
{"cond":"IR","extd":"Infra-Red source"},
{"cond":"FIR","extd":"Far-Infrared source"},
{"cond":"MIR","extd":"Mid-Infrared source"},
{"cond":"NIR","extd":"Near-Infrared source"},
{"cond":"","extd":""},
{"cond":"blu","extd":"Blue object"},
{"cond":"","extd":""},
{"cond":"UV","extd":"UV-emission source"},
{"cond":"","extd":""},
{"cond":"X","extd":"X-ray source"},
{"cond":"UX?","extd":"Ultra-luminous X-ray candidate"},
{"cond":"ULX","extd":"Ultra-luminous X-ray source"},
{"cond":"","extd":""},
{"cond":"gam","extd":"gamma-ray source"},
{"cond":"gB","extd":"gamma-ray Burst"},
{"cond":"","extd":""},
{"cond":"err","extd":"Not an object (error, artefact, ...)"},
{"cond":"","extd":""},
{"cond":"grv","extd":"Gravitational Source"},
{"cond":"Lev","extd":"(Micro)Lensing Event"},
{"cond":"LS?","extd":"Possible gravitational lens System"},
{"cond":"Le?","extd":"Possible gravitational lens"},
{"cond":"LI?","extd":"Possible gravitationally lensed image"},
{"cond":"gLe","extd":"Gravitational Lens"},
{"cond":"gLS","extd":"Gravitational Lens System (lens+images)"},
{"cond":"GWE","extd":"Gravitational Wave Event"},
{"cond":"","extd":""},
{"cond":"..?","extd":"Candidate objects"},
{"cond":"G?","extd":"Possible Galaxy"},
{"cond":"SC?","extd":"Possible Supercluster of Galaxies"},
{"cond":"C?G","extd":"Possible Cluster of Galaxies"},
{"cond":"Gr?","extd":"Possible Group of Galaxies"},
{"cond":"As?","extd":""},
{"cond":"**?","extd":"Physical Binary Candidate"},
{"cond":"EB?","extd":"Eclipsing Binary Candidate"},
{"cond":"Sy?","extd":"Symbiotic Star Candidate"},
{"cond":"CV?","extd":"Cataclysmic Binary Candidate"},
{"cond":"No?","extd":"Nova Candidate"},
{"cond":"XB?","extd":"X-ray binary Candidate"},
{"cond":"LX?","extd":"Low-Mass X-ray binary Candidate"},
{"cond":"HX?","extd":"High-Mass X-ray binary Candidate"},
{"cond":"Pec?","extd":"Possible Peculiar Star"},
{"cond":"Y*?","extd":"Young Stellar Object Candidate"},
{"cond":"TT?","extd":"T Tau star Candidate"},
{"cond":"C*?","extd":"Possible Carbon Star"},
{"cond":"S*?","extd":"Possible S Star"},
{"cond":"OH?","extd":"Possible Star with envelope of OH/IR type"},
{"cond":"WR?","extd":"Possible Wolf-Rayet Star"},
{"cond":"Be?","extd":"Possible Be Star"},
{"cond":"Ae?","extd":"Possible Herbig Ae/Be Star"},
{"cond":"HB?","extd":"Possible Horizontal Branch Star"},
{"cond":"RR?","extd":"Possible Star of RR Lyr type"},
{"cond":"Ce?","extd":"Possible Cepheid"},
{"cond":"WV?","extd":"Possible Variable Star of W Vir type"},
{"cond":"RB?","extd":"Possible Red Giant Branch star"},
{"cond":"sg?","extd":"Possible Supergiant star"},
{"cond":"s?r","extd":"Possible Red supergiant star"},
{"cond":"s?y","extd":"Possible Yellow supergiant star"},
{"cond":"s?b","extd":"Possible Blue supergiant star"},
{"cond":"AB?","extd":"Asymptotic Giant Branch Star candidate"},
{"cond":"LP?","extd":"Long Period Variable candidate"},
{"cond":"Mi?","extd":"Mira candidate"},
{"cond":"pA?","extd":"Post-AGB Star Candidate"},
{"cond":"BS?","extd":"Candidate blue Straggler Star"},
{"cond":"HS?","extd":"Hot subdwarf candidate"},
{"cond":"WD?","extd":"White Dwarf Candidate"},
{"cond":"N*?","extd":"Neutron Star Candidate"},
{"cond":"BH?","extd":"Black Hole Candidate"},
{"cond":"SN?","extd":"SuperNova Candidate"},
{"cond":"LM?","extd":"Low-mass star candidate"},
{"cond":"BD?","extd":"Brown Dwarf Candidate"},
{"cond":"","extd":""},
{"cond":"mul","extd":"Composite object"},
{"cond":"reg","extd":"Region defined in the sky"},
{"cond":"vid","extd":"Underdense region of the Universe"},
{"cond":"SCG","extd":"Supercluster of Galaxies"},
{"cond":"ClG","extd":"Cluster of Galaxies"},
{"cond":"GrG","extd":"Group of Galaxies"},
{"cond":"CGG","extd":"Compact Group of Galaxies"},
{"cond":"PaG","extd":"Pair of Galaxies"},
{"cond":"IG","extd":"Interacting Galaxies"},
{"cond":"C?*","extd":"Possible (open) star cluster"},
{"cond":"Gl?","extd":"Possible Globular Cluster"},
{"cond":"Cl*","extd":"Cluster of Stars"},
{"cond":"GlC","extd":"Globular Cluster"},
{"cond":"OpC","extd":"Open (galactic) Cluster"},
{"cond":"As*","extd":"Association of Stars"},
{"cond":"St*","extd":"Stellar Stream"},
{"cond":"MGr","extd":"Moving Group"},
{"cond":"**","extd":"Double or multiple star"},
{"cond":"EB*","extd":"Eclipsing binary"},
{"cond":"Al*","extd":"Eclipsing binary of Algol type"},
{"cond":"bL*","extd":"Eclipsing binary of beta Lyr type"},
{"cond":"WU*","extd":"Eclipsing binary of W UMa type"},
{"cond":"SB*","extd":"Spectroscopic binary"},
{"cond":"El*","extd":"Ellipsoidal variable Star"},
{"cond":"Sy*","extd":"Symbiotic Star"},
{"cond":"CV*","extd":"Cataclysmic Variable Star"},
{"cond":"DQ*","extd":"CV DQ Her type (intermediate polar)"},
{"cond":"AM*","extd":"CV of AM Her type (polar)"},
{"cond":"NL*","extd":"Nova-like Star"},
{"cond":"No*","extd":"Nova"},
{"cond":"DN*","extd":"Dwarf Nova"},
{"cond":"XB*","extd":"X-ray Binary"},
{"cond":"LXB","extd":"Low Mass X-ray Binary"},
{"cond":"HXB","extd":"High Mass X-ray Binary"},
{"cond":"","extd":""},
{"cond":"ISM","extd":"Interstellar matter"},
{"cond":"PoC","extd":"Part of Cloud"},
{"cond":"PN?","extd":"Possible Planetary Nebula"},
{"cond":"CGb","extd":"Cometary Globule"},
{"cond":"bub","extd":"Bubble"},
{"cond":"EmO","extd":"Emission Object"},
{"cond":"Cld","extd":"Cloud"},
{"cond":"GNe","extd":"Galactic Nebula"},
{"cond":"DNe","extd":"Dark Cloud (nebula)"},
{"cond":"RNe","extd":"Reflection Nebula"},
{"cond":"MoC","extd":"Molecular Cloud"},
{"cond":"glb","extd":"Globule (low-mass dark cloud)"},
{"cond":"cor","extd":"Dense core"},
{"cond":"SFR","extd":"Star forming region"},
{"cond":"HVC","extd":"High-velocity Cloud"},
{"cond":"HII","extd":"HII (ionized) region"},
{"cond":"PN","extd":"Planetary Nebula"},
{"cond":"sh","extd":"HI shell"},
{"cond":"SR?","extd":"SuperNova Remnant Candidate"},
{"cond":"SNR","extd":"SuperNova Remnant"},
{"cond":"of?","extd":"Outflow candidate"},
{"cond":"out","extd":"Outflow"},
{"cond":"HH","extd":"Herbig-Haro Object"},
{"cond":"","extd":""},
{"cond":"*","extd":"Star"},
{"cond":"V*?","extd":"Star suspected of Variability"},
{"cond":"Pe*","extd":"Peculiar Star"},
{"cond":"HB*","extd":"Horizontal Branch Star"},
{"cond":"Y*O","extd":"Young Stellar Object"},
{"cond":"Ae*","extd":"Herbig Ae/Be star"},
{"cond":"Em*","extd":"Emission-line Star"},
{"cond":"Be*","extd":"Be Star"},
{"cond":"BS*","extd":"Blue Straggler Star"},
{"cond":"RG*","extd":"Red Giant Branch star"},
{"cond":"AB*","extd":"Asymptotic Giant Branch Star (He-burning)"},
{"cond":"C*","extd":"Carbon Star"},
{"cond":"S*","extd":"S Star"},
{"cond":"sg*","extd":"Evolved supergiant star"},
{"cond":"s*r","extd":"Red supergiant star"},
{"cond":"s*y","extd":"Yellow supergiant star"},
{"cond":"s*b","extd":"Blue supergiant star"},
{"cond":"HS*","extd":"Hot subdwarf"},
{"cond":"pA*","extd":"Post-AGB Star (proto-PN)"},
{"cond":"WD*","extd":"White Dwarf"},
{"cond":"LM*","extd":"Low-mass star (M<1solMass)"},
{"cond":"BD*","extd":"Brown Dwarf (M<0.08solMass)"},
{"cond":"N*","extd":"Confirmed Neutron Star"},
{"cond":"OH*","extd":"OH/IR star"},
{"cond":"TT*","extd":"T Tau-type Star"},
{"cond":"WR*","extd":"Wolf-Rayet Star"},
{"cond":"PM*","extd":"High proper-motion Star"},
{"cond":"HV*","extd":"High-velocity Star"},
{"cond":"V*","extd":"Variable Star"},
{"cond":"Ir*","extd":"Variable Star of irregular type"},
{"cond":"Or*","extd":"Variable Star of Orion Type"},
{"cond":"Er*","extd":"Eruptive variable Star"},
{"cond":"RC*","extd":"Variable Star of R CrB type"},
{"cond":"RC?","extd":"Variable Star of R CrB type candiate"},
{"cond":"Ro*","extd":"Rotationally variable Star"},
{"cond":"a2*","extd":"Variable Star of alpha2 CVn type"},
{"cond":"Psr","extd":"Pulsar"},
{"cond":"BY*","extd":"Variable of BY Dra type"},
{"cond":"RS*","extd":"Variable of RS CVn type"},
{"cond":"Pu*","extd":"Pulsating variable Star"},
{"cond":"RR*","extd":"Variable Star of RR Lyr type"},
{"cond":"Ce*","extd":"Cepheid variable Star"},
{"cond":"dS*","extd":"Variable Star of delta Sct type"},
{"cond":"RV*","extd":"Variable Star of RV Tau type"},
{"cond":"WV*","extd":"Variable Star of W Vir type"},
{"cond":"bC*","extd":"Variable Star of beta Cep type"},
{"cond":"cC*","extd":"Classical Cepheid (delta Cep type)"},
{"cond":"gD*","extd":"Variable Star of gamma Dor type"},
{"cond":"SX*","extd":"Variable Star of SX Phe type (subdwarf)"},
{"cond":"LP*","extd":"Long-period variable star"},
{"cond":"Mi*","extd":"Variable Star of Mira Cet type"},
{"cond":"SN*","extd":"SuperNova"},
{"cond":"su*","extd":"Sub-stellar object"},
{"cond":"Pl?","extd":"Extra-solar Planet Candidate"},
{"cond":"Pl","extd":"Extra-solar Confirmed Planet"},
{"cond":"","extd":""},
{"cond":"G","extd":"Galaxy"},
{"cond":"PoG","extd":"Part of a Galaxy"},
{"cond":"GiC","extd":"Galaxy in Cluster of Galaxies"},
{"cond":"BiC","extd":"Brightest galaxy in a Cluster (BCG)"},
{"cond":"GiG","extd":"Galaxy in Group of Galaxies"},
{"cond":"GiP","extd":"Galaxy in Pair of Galaxies"},
{"cond":"rG","extd":"Radio Galaxy"},
{"cond":"H2G","extd":"HII Galaxy"},
{"cond":"LSB","extd":"Low Surface Brightness Galaxy"},
{"cond":"AG?","extd":"Possible Active Galaxy Nucleus"},
{"cond":"Q?","extd":"Possible Quasar"},
{"cond":"Bz?","extd":"Possible Blazar"},
{"cond":"BL?","extd":"Possible BL Lac"},
{"cond":"EmG","extd":"Emission-line galaxy"},
{"cond":"SBG","extd":"Starburst Galaxy"},
{"cond":"bCG","extd":"Blue compact Galaxy"},
{"cond":"LeI","extd":"Gravitationally Lensed Image"},
{"cond":"LeG","extd":"Gravitationally Lensed Image of a Galaxy"},
{"cond":"LeQ","extd":"Gravitationally Lensed Image of a Quasar"},
{"cond":"AGN","extd":"Active Galaxy Nucleus"},
{"cond":"LIN","extd":"LINER-type Active Galaxy Nucleus"},
{"cond":"SyG","extd":"Seyfert Galaxy"},
{"cond":"Sy1","extd":"Seyfert 1 Galaxy"},
{"cond":"Sy2","extd":"Seyfert 2 Galaxy"},
{"cond":"Bla","extd":"Blazar"},
{"cond":"BLL","extd":"BL Lac - type object"},
{"cond":"OVV","extd":"Optically Violently Variable object"},
{"cond":"QSO","extd":"Quasar"}];

function objecttype(ra, dec, name, diameter, type)
{
   this.ra        = ra;
   this.dec       = dec;
   this.name      = name;
   this.diameter  = diameter;
   this.type      = type;
   this.sortkey   = type + name;
}

function astrometry(window)
{
   var lines = window.astrometricSolutionSummary().split('\n');
   for (var i = 0; i < lines.length; i++)Console.writeln(i + '\t' + lines[i]);

   this.window = window;
   var pos      = getImageEQPosition(window);
   this.ra      = pos.x;
   this.dec     = pos.y;

   var zp       = window.imageToCelestial(new Point(0, 0));
   this.radius  = angularSeparation(zp.x, zp.y, this.ra, this.dec)

   this.rect    = new Rect(0, 0,
                              window.mainView.image.width,
                              window.mainView.image.height);

   this.includes = function(ra, dec)
   {
      var d = angularSeparation(ra, dec, this.ra, this.dec)
      if ( d > this.radius) return false;
      //
      var point = this.window.celestialToImage(ra, dec);
      return this.rect.includes(point);
   }
}

function CCparms()
{
   this.annotationScriptSet = false;
   this.currentDirectory = File.systemTempDirectory;
   this.currentfileName = "";
   this.maxdownload = 100;
   this.filenamePrefix = '';
   this.filenameSuffix = '';
   this.filenameAppendObjectTypes = false;
}

// **************************************************************************
// **************************************************************************
// **************************************************************************
//
//
//                         CustomCatalog dialog
//
//
// **************************************************************************
// **************************************************************************
// **************************************************************************
function showDialog(imageWindow)
{
   this.__base__ = Dialog;
   this.__base__();
   var dlg = this;

   Console.writeln('\nCreate or update an Annotation script CustomCatalog');
   Console.writeln('For a complete description of all available object type see:');
   Console.writeln('http://simbad.u-strasbg.fr/simbad/sim-display?data=otypes');
   Console.writeln('\n\tThis research has made use of the SIMBAD database,');
   Console.writeln('\toperated at CDS, Strasbourg, France\n');


   var ams = new astrometry(imageWindow);

   var dataChanged = false;

   var AnnotationSettingText = '\nAnnotation script settings updated';

   var parms = getParms();

   if (parms.maxdownload == null) parms.maxdownload = 100;
   if (!('filenamePrefix' in parms)) parms.filenamePrefix = "";
   if (!('annotationScriptSet' in parms)) parms.annotationScriptSet = false;
   if (!('filenameSuffix' in parms)) parms.filenameSuffix = '';
   if (!('filenameAppendObjectTypes' in parms)) parms.filenameAppendObjectTypes = false;

   if (!File.directoryExists(parms.currentDirectory))
      parms.currentDirectory = File.systemTempDirectory;

   var currentobjects = [];
   //
   //
   // **************************************************************************
   //
   // Controls definitions
   //
   // Labels
   //
   this.lblCopyright = new Label(this);
   this.lblFile      = new Label(this);
   this.lblFileCount = new Label(this);
   this.lblFileName  = new Label(this);
   this.lblObjType   = new Label(this);
   //
   // Buttons
   //
   this.btnDelete    = new PushButton(this);
   this.btnExit      = new PushButton(this);
   this.btnNameOpts  = new PushButton(this);
   this.btnNew       = new PushButton(this);
   this.btnOpen      = new PushButton(this);
   this.btnSave      = new PushButton(this);
   this.btnSaveAs    = new PushButton(this);
   //
   // Edit
   //
   this.tbxFile      = new Edit(this);
   this.tbxFileCount = new Edit(this);
   this.tbxType      = new Edit(this);
   //
   // Frames
   //
   this.botframe     = new Frame(this);
   this.commandFrame = new Frame(this);
   this.hFrame       = new Frame(this);
   this.midframe     = new Frame(this);
   this.midframe2    = new Frame(this);
   this.topframe     = new Frame(this);
   this.topleft      = new Frame(this);
   this.topright     = new Frame(this);
   //
   // ToolButtons
   //
   this.btnAdd       = new ToolButton(this);
   this.btnDel       = new ToolButton(this);
   this.btnTerms     = new ToolButton(this);
   //
   // TreeBoxes
   //
   this.tretypes     = new TreeBox(this);
   this.trefiles     = new TreeBox(this);
   //
   // NumericEdit(
   //
   this.maxDnld      = new NumericEdit(this);
   //
   // setup controls and associate event handlers
   //
   this.lblCopyright.text = '©';
   this.lblCopyright.textAlignment = TextAlign_Right | TextAlign_VertCenter;
   this.lblCopyright.toolTip = '<p>Collect one ore more objects by object types</p>' +
                               '<p><b> © 2021, Hartmut V. Bornemann<p>';

   this.lblObjType.textAlignment = TextAlign_Right | TextAlign_VertCenter;
   this.lblObjType.text = 'ObjectType:';

   this.lblFile.text = "FILE:";
   this.lblFile.textAlignment = TextAlign_Left | TextAlign_Top;

   this.lblFileCount.textAlignment = TextAlign_Left | TextAlign_VertCenter;
   this.lblFileCount.text = "Count:";

   this.btnNameOpts.icon = ':/script-editor/preferences.png';
   this.btnNameOpts.text = 'Options';
   this.btnNameOpts.toolTip = 'Setup custom catalog filename options';
   this.btnNameOpts.onClick = function ()
   {
      var dialog = new showOptionsDialog(parms, imageWindow.mainView.id);
	   var result = dialog.execute();
      if (result == 0) saveParms(parms);
   };

   this.btnTerms.text = "Terms of use of VizieR data";
   this.termsfont = new Font( this.font.family, this.font.pointSize - 1 );
   this.termsfont.underline = true;
   this.btnTerms.font = this.termsfont;
   this.btnTerms.onClick = function ()
   {
      Dialog.openBrowser( "http://cds.u-strasbg.fr/vizier-org/licences_vizier.html" );
   };

   this.tbxFileCount.backgroundColor  = 0xffffffff;
   this.tbxFileCount.setFixedWidth(this.tbxFileCount.height * 2);
   this.tbxFileCount.readOnly = true;
   this.tbxFileCount.toolTip = 'Objects found in the image frame';

   this.maxDnld.label.text = "Max. download:";
   this.maxDnld.setReal(false);
   this.maxDnld.setRange(1, 5000);
   this.maxDnld.setValue(parms.maxdownload);
   this.maxDnld.toolTip = 'Set the maximal number of records for each download';
   this.maxDnld.visible = false;
   this.maxDnld.onValueUpdated = function(value)
   {
      parms.maxdownload = value;
   }

   this.tbxType.setFixedWidth(this.tbxType.height * 2);

   this.lblFileName.text = "Custom catalog filename:";
   this.lblFileName.textAlignment = TextAlign_Left | TextAlign_Center;

   this.tbxFile.backgroundColor = 0xffffffff;
   this.tbxFile.readOnly = true;

   with (this.commandFrame)
   {
      setFixedWidth(this.btnNew.width);
      sizer = new VerticalSizer();
      sizer.add(this.btnNew);
      sizer.addSpacing(8);
      sizer.add(this.btnOpen);
      sizer.addSpacing(8);
      sizer.add(this.btnSave);
      sizer.addSpacing(8);
      sizer.add(this.btnSaveAs);
      sizer.addSpacing(8);
      sizer.add(this.btnDelete);
      sizer.addSpacing(8);
      sizer.addStretch();
      sizer.add(this.btnExit);
   }

   with (this.hFrame)
   {
      sizer = new HorizontalSizer();
      sizer.addStretch();
      sizer.add(this.commandFrame);
   }

   with (this.topleft)
   {
      sizer = new VerticalSizer();
      sizer.add(this.tretypes);
   }

   with (this.topright)
   {
      setFixedWidth(this.commandFrame.width + 16);
      setMinHeight(this.btnNew.height * 8 + 16);
      sizer = new VerticalSizer();
      sizer.margin = 4;
      sizer.add(this.lblCopyright);
      sizer.addSpacing(8);
      sizer.add(this.lblFile);
      sizer.addSpacing(8);
      sizer.add(this.hFrame);
   }

   with (this.topframe )
   {
      sizer = new HorizontalSizer();
      sizer.margin = 4;
      sizer.add(this.topleft);
      sizer.add(this.topright);
   }

   with (this.midframe )
   {
      sizer = new HorizontalSizer();
      sizer.margin = 4;
      sizer.add(this.lblObjType);
      sizer.addSpacing(8);
      sizer.add(this.tbxType);
      sizer.addSpacing(8);
      sizer.add(this.btnAdd);
      sizer.addSpacing(8);
      sizer.add(this.btnDel);
      sizer.addSpacing(8);
      sizer.add(this.lblFileName)
      sizer.addSpacing(8);
      sizer.add(this.tbxFile)
   }

   with (this.midframe2)
   {
      sizer = new HorizontalSizer();
      sizer.margin = 4;
      sizer.add(this.lblFileCount);
      sizer.addSpacing(8);
      sizer.add(this.tbxFileCount);
      sizer.addSpacing(8);
      sizer.add(this.maxDnld);
      sizer.addStretch();
      sizer.add(this.btnNameOpts);
      sizer.addSpacing(8);
      sizer.add(this.btnTerms);
   }

   with (this.botframe )
   {
      sizer = new Sizer();
      sizer.margin = 4;
      sizer.add(this.trefiles);
   }

   // button contents

   with (this.btnNew)
   {
      icon = this.scaledResource(":/browser/document.png");
      text = "     New";
      onClick = function(checked )
      {
         if (dataChanged)
         {
            var msg = new MessageBox("Objects table changed, save now?",
               ID, StdIcon_Question, StdButton_Yes, StdButton_No);
            var res = msg.execute();
            if (res == StdButton_Yes)
            {
               if (parms.currentfileName != "")
               {
                  writeObjectsFile(parms.currentfileName, currentobjects);
                  dataChanged = false;
               }
               else
               {
                  var sfd = new SaveFileDialog;
                  sfd.initialPath = parms.currentDirectory;
                  sfd.caption = "Save annotation custom catalog";
                  sfd.overwritePrompt = true;
                  sfd.filters = [["Annotation catalog", ".txt"]];

                  if ( sfd.execute() )
                  {
                     parms.currentfileName = sfd.fileName;
                     parms.currentDirectory = File.extractDirectory(sfd.fileName);
                     writeObjectsFile(parms.currentfileName, currentobjects);
                     dataChanged = false;
                     dlg.btnSave.enabled = true;
                     saveParms(parms);
                  }
               }
            }
            else
               return;
         }
         parms.currentfileName = "";
         dlg.trefiles.clear();
         dataChanged = false;
         dlg.btnSave.enabled = false;
         dlg.btnDelete.enabled = false;
         dlg.tbxFile.text = "";
      }
   }

   with (this.btnOpen)
   {
      icon = this.scaledResource(":/toolbar/file-open.png");
      text = "    Open";
      onClick = function(checked )
      {
         var ofd = new OpenFileDialog();
         with (ofd)
         {
            caption = "open an existing annotation custom catalog [.csv]"; // a jpeg image file";
            multipleSelections = false;
            filters = [["Annotation catalog", ".csv"]];
            initialPath = parms.currentDirectory;
            if (execute())
            {
               currentobjects = [];
               dlg.tbxFile.text = '';
               var newobjects = readobjectsFile(fileName);
               currentobjects = addobjects(currentobjects, newobjects)
               currentobjects = validobjects(currentobjects, ams);

               if (currentobjects.length == 0)
               {
                  message('the objects loaded do not belong to the current image');
               }
            }

            fillobjectstreebox(currentobjects, imageWindow, dlg.trefiles, dlg.tbxFileCount);
            dataChanged = false;

            if (currentobjects.length > 0)
            {
               parms.currentfileName = fileName;
               parms.currentDirectory = File.extractDirectory(fileName);
               dlg.btnSave.enabled = true;
               dlg.btnSaveAs.enabled = true;
               if (dlg.trefiles.numberOfChildren > 0)
                  dlg.tbxFile.text = File.extractNameAndExtension(fileName);
               dlg.btnDelete.enabled = true;
            }
            else
            {
               parms.currentfileName = "";
               dlg.btnSave.enabled = false;
               dlg.btnSaveAs.enabled = false;
               dlg.btnDelete.enabled = false;
            }
         }
      }
   }

   with (this.btnSave)
   {
      icon = this.scaledResource(":/icons/save.png");
      enabled = false;
      text = "    Save";

      onPress = function()
      {
         if (File.exists(parms.currentfileName))
         {
            writeObjectsFile(parms.currentfileName, currentobjects);
            dataChanged = false;
            var txt = '';
            if (setAnnotationScriptCustomCatalog(parms)) txt = AnnotationSettingText;
            message('File ' + parms.currentfileName + ' saved' + txt);
         }
      }
   }

   with (this.btnSaveAs)
   {
      icon = this.scaledResource(":/icons/save-as.png");
      enabled = false;
      text = "Save as";
      onPress = function()
      {
         var sfd = new SaveFileDialog;
         sfd.caption = "Save annotation custom catalog";
         sfd.overwritePrompt = true;
         sfd.filters = [["Annotation catalog", ".csv"]];
         var filename = createFilename(imageWindow, currentobjects, parms);
         sfd.initialPath = parms.currentDirectory + '\\' + filename;

         if ( sfd.execute() )
         {
            parms.currentfileName = sfd.fileName;
            parms.currentDirectory = File.extractDirectory(sfd.fileName);
            writeObjectsFile(parms.currentfileName, currentobjects);
            dataChanged = false;
            dlg.btnSave.enabled = true;
            dlg.btnDelete.enabled = true;
            saveParms(parms);
            dlg.tbxFile.text = File.extractNameAndExtension(sfd.fileName);
            /*
            var txt = '';
            if (setAnnotationScriptCustomCatalog(parms)) txt = AnnotationSettingText;
            message('File ' + parms.currentfileName + ' saved' + txt);
            */
         }
      }
   }

   with (this.btnDelete)
   {
      enabled = false;
      text = "  Delete";
      icon = this.scaledResource(":/icons/delete.png");
      onPress = function()
      {
         var msg = new MessageBox("Confirm deletion of " +
            File.extractNameAndExtension(parms.currentfileName),
            ID, StdIcon_Question, StdButton_Yes, StdButton_No);
         var res = msg.execute();
         if (res == StdButton_Yes)
         {
            File.remove(parms.currentfileName);
            message('File ' + parms.currentfileName + ' deleted');
            resetAnnotationScriptCustomCatalog(parms);
         }
         dlg.btnDelete.enabled = false;
      }
   }

   with (this.btnExit)
   {
      text = "     Exit";
      icon = this.scaledResource(":/toolbar/file-exit.png");
      toolTip = "<b>Quit this script</b>";
      onPress = function()
      {
         if (dataChanged && currentobjects.length > 0)
         {
            var msg = new MessageBox("Objects table changed, save now?",
               ID, StdIcon_Question, StdButton_Yes, StdButton_No);
            var res = msg.execute();
            if (res == StdButton_Yes)
            {
               var sfd = new SaveFileDialog;
               sfd.caption = "Save annotation custom catalog";
               sfd.overwritePrompt = true;
               sfd.filters = [["Annotation catalog", ".csv"]];
               var filename = createFilename(imageWindow, currentobjects, parms);
               sfd.initialPath = parms.currentDirectory + '\\' + filename;

               if ( sfd.execute() )
               {
                  parms.currentfileName = sfd.fileName;
                  parms.currentDirectory = File.extractDirectory(sfd.fileName);
                  writeObjectsFile(parms.currentfileName, currentobjects);

                  /*  var txt = '';
                  if (setAnnotationScriptCustomCatalog(parms)) txt = AnnotationSettingText;
                  message('File ' + parms.currentfileName + ' saved' + txt);
                  */
               }
            }
         }
         Console.writeln("Script " + ID + " end");
         Console.hide();
         saveParms(parms);
         dlg.done(0);
      }
   }

   with (this.btnAdd)
   {
      icon = this.scaledResource(':/icons/download.png');
      enabled = false;
      toolTip = "<p>Download objects from Simbad catalogs and add to current list</p>";
      onPress = function()
      {
         var type = dlg.tbxType.text.trim();
         if (objecttypevalid(OBJTYPES, type))
         {
            var newobjects = adqlQuerySimbad(server, type,
                              ams.ra, ams.dec, ams.radius, parms.maxdownload);
            var count = currentobjects.length;
            currentobjects = addobjects(currentobjects, newobjects);
            currentobjects = validobjects(currentobjects, ams);
            fillobjectstreebox(currentobjects, imageWindow, dlg.trefiles, dlg.tbxFileCount);
            dataChanged = currentobjects.length > count;
            dlg.btnSaveAs.enabled = currentobjects.length > 0;
            dlg.btnDel.enabled = dataChanged;
            dlg.btnAdd.enabled = false;
         }
      }
   }

   with (this.btnDel)
   {
      icon = this.scaledResource(':/toolbar/file-clear-recent.png');
      enabled = false;
      toolTip = "<p>Remove object type from list</p>";
      onPress = function()
      {
         var count = currentobjects.length;
         currentobjects = removeObjects(currentobjects, dlg.tbxType.text);
         fillobjectstreebox(currentobjects, imageWindow, dlg.trefiles, dlg.tbxFileCount)
         dataChanged = count > currentobjects.length;
         dlg.btnSaveAs.enabled = currentobjects.length > 0;
         dlg.btnSave.enabled = dlg.btnSave.enabled && dlg.btnSaveAs.enabled;
      }
   }

   //

   with (this.tbxType)
   {
      toolTip = "<p>Enter a valid object type or pic a type from the types table above</p>";

      onTextUpdated = function(text)
      {
         if (typenamechanged(text.trim(), currentobjects, dlg.btnAdd, dlg.btnDel))
         {
            for (var i = 0; i < dlg.tretypes.numberOfChildren; i++)
            {
               var node = dlg.tretypes.child(i);
               if (node.text(1).toLowerCase() == text.trim().toLowerCase())
               {
                  dlg.tretypes.currentNode = node;
                  dlg.tretypes.setNodeIntoView(node);
                  break;
               }
            }
         }
      }
   }

   with (this.tretypes)
   {
      headerSorting = true;
      multipleSelection = false;
      setScaledMinWidth(350);
      toolTip = "<p>Select an object type from this types table</p>";
      var j = 1;
      for (var i = 0; i < OBJTYPES.length; i++)
      {
         var otyp = OBJTYPES[i];
         if(otyp.cond == "") continue;
         var tn = new TreeBoxNode();

         var n = j.toString();

         while (n.length < 3) n = ' ' + n;

         tn.setText(0, n);
         tn.setText(1, otyp.cond);
         tn.setText(2, otyp.extd);
         add(tn);

         j += 1;
      }

      setHeaderText(0, 'Nr.');
      setHeaderText(1, 'ObjectType');
      setHeaderText(2, 'Description');
      adjustColumnWidthToContents(0);
      adjustColumnWidthToContents(1);
      adjustColumnWidthToContents(2);

      sort(0);

      onNodeClicked = function(item, index)
      {
         if (item.text(1).length > 0) dlg.tbxType.text = item.text(1);
         typenamechanged(dlg.tbxType.text, currentobjects, dlg.btnAdd, dlg.btnDel);
      }
   }

   with (this.trefiles)
   {
      headerSorting = true;
      setHeaderText(0, 'Ra');
      setHeaderText(1, 'Dec');
      setHeaderText(2, 'Name');
      setHeaderText(3, 'Diameter');
      setHeaderText(4, 'Type');

      toolTip = 'Display of objects currently collected.\n' +
      'For more details on any object, doubleclick the row containing the name';

      fillobjectstreebox(currentobjects, imageWindow, this.trefiles, this.tbxFileCount);

      onNodeDoubleClicked = function(item, columnIndex)
      {
         var name = item.text(2);
         name = fixedEncodeURIComponent(name);
         var url = server + 'simbad/sim-id?output.format=HTML&Ident=' + name;
         Dialog.openBrowser(url);
      }
   }

   this.setScaledMinSize(640,480);

   this.sizer = new VerticalSizer();
   this.sizer.margin = 4;
   this.sizer.add(this.topframe);
   this.sizer.addSpacing(8);
   this.sizer.add(this.midframe);
   this.sizer.add(this.midframe2);
   this.sizer.add(this.botframe);


   this.windowTitle = TITLE + ' ' + VERSION + ', ' + imageWindow.mainView.id;

	this.adjustToContents();

 	this.userResizable = true;
}

function typenamechanged(type, currentobjects, btnAdd, btnDel)
{
   type = type.trim();
   var valid = objecttypevalid(OBJTYPES, type);
   btnAdd.enabled = valid > 0 && !objecttypestored(currentobjects, type);
   btnDel.enabled = valid > 0 && objecttypestored(currentobjects, type);
   return valid;
}

function addobjects(currentobjects, newobjects)
{
   for (var i = 0; i < newobjects.length; i++)
   {
      var obj  = newobjects[i];
      var name = obj.name;
      for (var j = 0; j < currentobjects.length; j++)
      {
         if (currentobjects[j].name == name)
         {
            name = "";
            break;
         }
      }
      if (name == "") continue;
      currentobjects.push(obj);
   }
   return currentobjects;
}

function validobjects(currentobjects, astrometry)
{
   var validobjs = [];
   for (var i = 0; i < currentobjects.length; i++)
   {
      var obj = currentobjects[i];
      if (!astrometry.includes( obj.ra, obj.dec )) continue;
      validobjs.push(obj);
   }
   return validobjs;
}

function fillobjectstreebox(currentobjects, imageWindow, treebox, countbox)
{
   treebox.clear();

   for (var i = 0; i < currentobjects.length; i++)
   {
      var obj = currentobjects[i];

      var tn = new TreeBoxNode();
      tn.setText(0, obj.ra.toFixed(8));
      tn.setText(1, obj.dec.toFixed(8));
      tn.setText(2, obj.name);
      tn.setText(3, obj.diameter.toFixed(3));
      tn.setText(4, obj.type);
      treebox.add(tn);
   }

   if (treebox.numberOfChildren  > 0)
   {
      treebox.adjustColumnWidthToContents(0);
      treebox.adjustColumnWidthToContents(1);
      treebox.adjustColumnWidthToContents(2);
      treebox.adjustColumnWidthToContents(3);
      treebox.adjustColumnWidthToContents(4);
   }

   countbox.text = treebox.numberOfChildren.toString();
}

function readobjectsFile(filename)
{
   var records = [];
   if (!File.exists(filename)) return records;
   var lines = File.readLines(filename);
   if (lines.length < 2) return records;
   var h = lines[0].split('\t');
   for (var i = 0; i < h.length; i++) h[i] = h[i].trim().toLowerCase();
   var iRa = h.indexOf('ra');
   var iDe = h.indexOf('dec');
   var iNa = h.indexOf('name');
   var iDi = h.indexOf('diameter');
   var iTy = h.indexOf('type');

   if (iRa < 0 | iDe < 0 | iNa < 0) return records;

   for (var i = 1; i < lines.length; i++)
   {
      var line = lines[i];
      line = line.trim();
      if (line.length == 0) continue;
      var items = line.split('\t');
      for (var k= 0; k < items.length; k++) items[k] = items[k].trim();

      var ra = parseFloat(items[iRa]);
      var dec = parseFloat(items[iDe]);
      var name = items[iNa];
      var diameter = 0;
      var type = "any";

      if (iDi > -1 & items.length > iDi)
      {
         if (!nullorempty(items[iDi])) diameter = parseFloat(items[iDi]);
      }

      if (iTy > -1 & items.length > iTy)
      {
         if (!nullorempty(items[iTy])) type = items[iTy];
      }

      records.push(new objecttype( ra, dec, name, diameter, type));
   }

   return records;
}

function writeObjectsFile(filename, currentobjects)
{
   var lines = [];
   lines.push('RA\tDEC\tNAME\tDIAMETER\tTYPE');
   for (var i = 0; i < currentobjects.length; i++)
   {
      var otype = currentobjects[i];
      with (otype)
      {
         var line = ra.toFixed(8) + '\t' + dec.toFixed(8) + '\t' +
            name + '\t' + diameter.toFixed(3)  + '\t' + type;
         lines.push(line);
      }
   }
   File.writeTextFile(filename, lines.join('\n'));
}

function removeObjects(currentobjects, type)
{
   type = type.trim();
   var objlist = [];
   for (var j = 0; j < currentobjects.length; j++)
   {
      if (!equal(currentobjects[j].type, type)) objlist.push(currentobjects[j]);
   }
   return objlist;
}

function objecttypestored(currentobjects, type)
{
   for (var i = 0; i < currentobjects.length; i++)
   {
      if (currentobjects[i].type == "") continue;
      if (equal(currentobjects[i].type, type)) return true;
   }
   return false;
}

function objecttypevalid(objecttypes, type)
{
   if (type == "") return false;
   for (var i = 0; i < objecttypes.length; i++)
   {
      if (equal(objecttypes[i].cond, type)) return true;
   }
   return false;
}

function equal(s1, s2)
{
   return s1.toLowerCase() == s2.toLowerCase();
}

function nullorempty(s)
{
   return s === "";
}

function adqlQuerySimbad(server, objectType, ra, dec, radius, outputmax)
{
   var query = "simbad/sim-tap/sync?";

   query += "request=doQuery&lang=adql&format=text&query=SELECT TOP " +
               outputmax.toString() + " MAIN_ID,RA,DEC,galdim_majaxis FROM BASIC";

   query += " WHERE otype='" + objectType.trim() + "'";

   query += " AND CONTAINS(POINT('ICRS',ra, dec),";

   query += " CIRCLE('ICRS'," + ra.toFixed(8) + "," + dec.toFixed(8) + "," + radius.toFixed(3);

   query += ")) = 1 AND ra IS NOT NULL AND dec IS NOT NULL";

   var filename = File.systemTempDirectory + '/adql.txt';

   if (File.exists(filename)) File.remove(filename);

   var url = server + query;

   Console.writeln('Download ' + url);

   var downloader = new FileDownload( url, filename );

   if (downloader.perform())
   {
      if (File.exists(  filename))
      {
         var objecttypes = [];

         var datapart = false;

         var lines = File.readLines(filename);

         for (var i = 0; i < lines.length; i++)
         {
            var line = lines[i];

            var items = line.split('|');

            if (items.length != 4) continue;

            if (!datapart)
            {
               datapart = line.startsWith('--------');
               continue;
            }

            var name       = items[0].trim().unquote();

            var raStr      = items[1].trim();
            var r          = parseFloat(raStr);
            var deStr      = items[2].trim();
            var d          = parseFloat(deStr);

            var diameter;

            if (nullorempty(items[3].trim()))
               diameter = 0;
            else
               diameter = parseFloat(items[3].trim());

            objecttypes.push(new objecttype(r, d, name, diameter, objectType));
         }

         File.remove(filename);

         Console.writeln('Download completed: ' + objecttypes.length +
            ' objects found');

         return objecttypes;
      }
   }
   return null;
}


function querySimbadName(server, name)
{
   name = fixedEncodeURIComponent(name);

   var url = server + 'simbad/sim-id?output.format=HTML&Ident=' + name;

   var filename = File.systemTempDirectory + '/simbad.html';

   if (File.exists(filename)) File.remove(filename);

   var downloader = new FileDownload( url, filename );

   if (downloader.perform())
      return filename;
   else
      return "";
}

function getImageEQPosition(window)
{
   var ra  = parseFloat(getKeyValue(window, "RA"));
   var dec = parseFloat(getKeyValue(window, "DEC"));
   Console.writeln("Position " + ra + ", " + dec);
   return new Point(ra, dec);
}

function setAnnotationScriptCustomCatalog(parms)
{
   Console.writeln('Save=' + parms.currentfileName);
   //
   // set current annotation script custom catalog
   //
   if (parms.annotationScriptSet)
   {
      var s = Settings.read ('ANNOT/engine/layers', DataType_UCString );
      var layers = s.split('|');

      var n = [];

      for (var i = 0; i < layers.length; i++)
      {
         if (layers[i] == 'Custom Catalog') n.push(i);
      }

      var key;

      for (var i = 0; i < n.length; i++)
      {
         var l = n[i];
         key = 'ANNOT/ly' + l.toString();
         var catalogPath = Settings.read (key + '/catalogPath', DataType_UCString);
         if (catalogPath == parms.currentfileName)
         {
            Settings.write(key + '/visible', DataType_Boolean, true);
            return true;
         }
         if (catalogPath == "" || catalogPath == null)
         {
            Settings.write(key + '/visible', DataType_Boolean, true);
            Settings.write(key + '/catalogPath', DataType_UCString, parms.currentfileName);

            return true;
         }
      }

      // add

      layers.push('Custom Catalog');
      Settings.write('ANNOT/engine/layers', DataType_UCString, layers.join('|'));
      var ly = layers.length -1;
      key = 'ANNOT/ly' + ly.toString();
      Settings.write(key + '/visible', DataType_Boolean, true);
      Settings.write(key + '/catalogPath', DataType_UCString, parms.currentfileName);

      return true;
   }
   return false;
}

function resetAnnotationScriptCustomCatalog(parms)
{
   var s = Settings.read ('ANNOT/engine/layers', DataType_UCString );
   var layers = s.split('|');

   var n = [];

   for (var i = 0; i < layers.length; i++)
   {
      if (layers[i] == 'Custom Catalog') n.push(i);
   }

   var key;

   for (var i = 0; i < n.length; i++)
   {
      var l = n[i];
      key = 'ANNOT/ly' + l.toString();
      var catalogPath = Settings.read (key + '/catalogPath', DataType_UCString);
      if (catalogPath == parms.currentfileName)
      {
         Settings.write(key + '/visible', DataType_Boolean, true);
         Settings.write(key + '/catalogPath', DataType_UCString, "");
         Console.writeln(parms.currentfileName + ' removed from Annotation script settings');
      }
   }
}

function angularSeparation(ra1, de1, ra2, de2)
{
   // degrees to radiant
   var a1 = ra1 * Math.RAD;
   var a2 = ra2 * Math.RAD;
   var d1 = de1 * Math.RAD;
   var d2 = de2 * Math.RAD;
   var z  = Math.acos(Math.sin(d1) * Math.sin(d2) + Math.cos(d1) * Math.cos(d2) * Math.cos(a1 - a2));
   var d  = Math.abs(z) * Math.DEG;
   return d % 360.0;
}

function getParms()
{
   var parms = new CCparms();
   var setts = Settings.read(ID + "/parms", DataType_String );
   Console.writeln("Settings: "+setts);
   if (setts != null) parms = JSON.parse(setts);
   return parms;
}

function saveParms(parms)
{
   try
   {
      Settings.write(ID + "/parms", DataType_String, JSON.stringify(parms));
   }
   catch (ex)
   {
      message('saveParms: ' + ex);
   }
}

function getKeyValue(window, keyName)
{
   //
   // search key keyName
   //
   for (var i = 0; i <  window.keywords.length; i++)
   {
      var fitskey = window.keywords[i];
      {
         if (fitskey.name == keyName)
         {
            return fitskey.value;
         }
      }
   }
   Console.writeln("key " + keyName + ' not found');
   return null;
}

function getKeyComment(window, keyName)
{
   //
   // search key keyName
   //
   for (var i in window.keywords)
   {
      with (window.keywords[i])
      {
         if (name == keyName)
         {
            var s = comment;
            return s;
         }
      }
   }
   return null;
}

function getKeyString(window, keyName)
{
   //
   // search key keyName
   //
   for (var i in window.keywords)
   {
      with (window.keywords[i])
      {
         if (name == keyName)
         {
            var s = strippedValue;
            return s;
         }
      }
   }
   return null;
}


function getProjection(comment)
{
   var a = comment.split(':');
   if (a.length == 2) return a[1].trim();
   return "";
}

function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

function message(txt)
{
   new MessageBox(txt, ID, StdIcon_Information).execute();
}

function errMessage(txt)
{
   new MessageBox(txt, ID, StdIcon_Error).execute();
}

function createFilename(imageWindow, currentobjects, parms)
{
   var id = parms.filenamePrefix + imageWindow.mainView.id;

   if (!parms.filenameAppendObjectTypes)
   {
      id += parms.filenameSuffix;
   }
   else
   {
      var types = [];
      for (var i = 0; i < currentobjects.length; i++)
      {
         var type = currentobjects[i].type;
         if (types.indexOf(type) < 0) types.push(type);
      }

      id += '_' + types.join('_');

      while (id.contains('?')) id = id.replace('?', '~');
      while (id.contains('*')) id = id.replace('*', '#');
   }

   return id + '.csv';
}

function showOptionsDialog(parms, id)
{
   this.__base__ = Dialog;
   this.__base__();
   var dlg = this;
   //
   // Checkboxes
   //
   this.cbxApplAnnot = new CheckBox(this);
   this.cbxAppObjSuffix = new CheckBox(this);
   //
   // Labels
   //
   this.lblPrefix    = new Label(this);
   this.lblSuffix    = new Label(this);
   //
   // Edit boxes
   //
   this.editPrefix = new Edit(this);
   this.editSuffix = new Edit(this);
   //
   // Buttons
   //
   this.btnOK = new PushButton(this);
   this.btnCancel = new PushButton(this);
   this.btnCancel.text = 'Cancel';
   //
   // Numeric
   //
   this.maxDnld = new NumericEdit(this);
   //
   // Frames
   //
   this.framePrefix = new Frame(this);
   this.frameSuffix = new Frame(this);
   this.frameMaxDld = new Frame(this);
   this.frameButtons = new Frame(this);
   this.frameCheckbx = new Frame(this);
   //
   // Setup controls
   //
   //
   this.cbxApplAnnot.checked = parms.annotationScriptSet;
   this.cbxApplAnnot.text = 'Add to Annotation';
   this.cbxApplAnnot.toolTip =
      'Check this to apply and activate the file into the Annotation custom catalog collection';
   //
   this.cbxAppObjSuffix.checked = parms.filenameAppendObjectTypes;
   this.cbxAppObjSuffix.text = 'Append object types to filename';
   this.cbxAppObjSuffix.toolTip =
      '<b>For newly created files:</b><p>If checked, all used object types will be appended to the filename</p>' +
      'I.e.: filename = ' + id + '_SNR_PN.txt, if object types SNR and PN have been colleted in the table.';
    this.cbxAppObjSuffix.onCheck = function(checked)
   {
      dlg.editSuffix.enabled = !checked;
   }
   //
   // Labels
   //
   this.lblPrefix.text = 'Prefix:';
   this.lblSuffix.text = 'Suffix:';
   this.lblPrefix.textAlignment = TextAlign_Left | TextAlign_Center;
   this.lblSuffix.textAlignment = TextAlign_Left | TextAlign_Center;
   //
   // Edit
   //
   this.editPrefix.text = parms.filenamePrefix;
   this.editPrefix.toolTip = '<b>For newly created files:</b><p>String to prepend to the filename</p>' +
      'I.e.: filename = _' + id + '.txt, if an underscore _ was set as prefix.';
   this.editSuffix.text = parms.filenameSuffix;
   this.editSuffix.toolTip = '<b>For newly created files:</b><p>String to append to the filename</p>' +
      'I.e.: filename = ' + id + '_.txt, if an underscore _ was set as suffix.';
   this.editSuffix.enabled = !parms.filenameAppendObjectTypes;
   //
   this.btnOK.text = 'OK';
   this.btnOK.onClick = function ( checked )
   {
      parms.filenamePrefix = dlg.editPrefix.text;
      parms.filenameSuffix = dlg.editSuffix.text;
      parms.filenameAppendObjectTypes = dlg.cbxAppObjSuffix.checked;
      parms.annotationScriptSet = dlg.cbxApplAnnot.checked;
      parms.maxdownload = dlg.maxDnld.value;
      dlg.done(0);
   }
   //
   this.btnCancel.onClick = function ( checked )
   {
      dlg.done(-1);
   }
   //
   this.maxDnld.label.text = "Max. download:";
   this.maxDnld.setReal(false);
   this.maxDnld.setRange(1, 5000);
   this.maxDnld.setValue(parms.maxdownload);
   this.maxDnld.toolTip = 'Set the maximal number of records for each download';
   //
   // Frames
   //
   this.framePrefix.sizer = new HorizontalSizer();
   this.framePrefix.sizer.margin = 4;
   this.framePrefix.sizer.add(this.lblPrefix);
   this.framePrefix.sizer.addSpacing (8);
   this.framePrefix.sizer.add(this.editPrefix);
   //
   this.frameSuffix.sizer = new HorizontalSizer();
   this.frameSuffix.sizer.margin = 4;
   this.frameSuffix.sizer.add(this.lblSuffix);
   this.frameSuffix.sizer.addSpacing (8);
   this.frameSuffix.sizer.add(this.editSuffix);
   //
   this.frameButtons.sizer = new HorizontalSizer();
   this.frameButtons.sizer.margin = 4;
   this.frameButtons.sizer.add(this.btnCancel);
   this.frameButtons.sizer.addSpacing(8);
   this.frameButtons.sizer.add(this.btnOK);
   //
   this.frameMaxDld.sizer = new HorizontalSizer();
   this.frameMaxDld.sizer.margin = 4;
   this.frameMaxDld.sizer.add(this.maxDnld);
   this.frameMaxDld.sizer.addStretch();
   //
   this.frameCheckbx.sizer = new HorizontalSizer();
   this.frameCheckbx.sizer.margin = 4;
   this.frameCheckbx.sizer.add(this.cbxApplAnnot);
   //
   this.sizer = new VerticalSizer();
   this.sizer.margin = 4;
   this.sizer.add(this.framePrefix);
   this.sizer.addSpacing(8);
   this.sizer.add(this.cbxAppObjSuffix);
   this.sizer.add(this.frameSuffix);
   this.sizer.addSpacing(8);
   this.sizer.add(this.frameMaxDld);
   this.sizer.addSpacing(8);
   this.sizer.add(this.frameCheckbx);
   this.sizer.addSpacing(8);
   this.sizer.add(this.frameButtons);

   this.windowTitle = 'Setup custom catalog naming options';

	this.adjustToContents();

 	this.userResizable = false;

   processEvents();

   this.setFixedSize(this.width * 1.2, this.height * 1.2);
}

showDialog.prototype = new Dialog;
showOptionsDialog.prototype = new Dialog;


function main()
{
   // *******************************************************************************
   //
   // check view on color and WCS
   //
   var window = ImageWindow.activeWindow;

   if ( window.isNull )
   {
      errMessage( "No active image" );
      return;
   }
   try
   {
      window.regenerateAstrometricSolution();
   }
   catch (ex) {}

   if ( window.hasAstrometricSolution == null )
   {
      errMessage( "Image has no astrometric solution" );
      return;
   }

   // *******************************************************************************
   // run dialog
   // *******************************************************************************
   Console.show();

 	var dialog = new showDialog(window);
	dialog.execute();
}


main ();
