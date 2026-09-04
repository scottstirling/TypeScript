# TypeCat

## TypeCat: a SIMBAD catalog creator for the use with PixInsight AnnotateImage and AnnotateImageExt

  If one or more object types are required for an image analysis, **TypeCat** can create the list of existing objects for the **AnnotateImage** script to use as a Custom catalog layer. **TypeCat** searches SIMBAD for all occurrences of an object type and collects the results in a file. For example, if all infrared sources, carbon stars and quasars are to be identified, the search terms **IR**, **C \*** and **QSO** must be entered one after the other. The saved custom-catalog formatted file can then be used by PixInsight annotation scripts.

## Provenance and History

With permission of Hartmut Bornemann, per 8/2026 email, versioning and extending his **TypeCat** PixInsight script in public GitHub, retaining rights and original authorship to Hartmut Bornemann.

Legacy **TypeCat** and a whole suite of other scripts by Hartmut Bornemann are hosted under [Astrophotography by Herbert Walter](https://www.skypixels.at/index.html) at:
 - https://www.skypixels.at/pixinsight_scripts.html

The PixInsight update repository for the legacy scripts is:
  - https://www.skypixels.at/HVB_Repository/

If you know how to run scripts from PixInsight's **SCRIPT** menu, you can download **TypeCat.js** from this GitHub repository and run it locally from any directory.  There will be releases and tags versioning changes.  Distribution of managed updates may continue through Mr. Walter's site, TBD (as of 9/3/2026).

Goals of this project include:
  - set a baseline versioned codebase
  - fix some minor issues for platform portability and changes in PixInsight (e.g., integration with Annotation.js, which is gone, having been replaced by AnnotateImage.js)
  - make a few enhancements to usability and functionality of the script
  - release a version for PixInsight 1.9.4+ V8 runtime
  - retain Hartmut Bornemann's copyright and original authorship

## Acknowledgments

This project makes use of the **SIMBAD database**, operated at CDS, Strasbourg, France. 

If you use this script in an academic publication, please cite the foundational SIMBAD paper:
  * Wenger, M., et al. (2000). *The SIMBAD astronomical database*. Astronomy and Astrophysics Supplement Series, 143, 9-22. [DOI: 10.1051/aas:2000332](https://doi.org)
