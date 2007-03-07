if(typeof dojo == "undefined"){

/**
* @file bootstrap1.js
*
* summary: First file that is loaded that 'bootstraps' the entire dojo library suite.
* note:  Must run before hostenv_*.js file.
*
* @author  Copyright 2004 Mark D. Anderson (mda@discerning.com)
* TODOC: should the copyright be changed to Dojo Foundation?
* @license Licensed under the Academic Free License 2.1 http://www.opensource.org/licenses/afl-2.1.php
*
* $Id: bootstrap1.js 6824 2006-12-06 09:34:32Z alex $
*/

// TODOC: HOW TO DOC THE BELOW?
// @global: djConfig
// summary:
//		Application code can set the global 'djConfig' prior to loading
//		the library to override certain global settings for how dojo works.
// description:  The variables that can be set are as follows:
//			- isDebug: false
//			- allowQueryConfig: false
//			- baseScriptUri: ""
//			- baseRelativePath: ""
//			- libraryScriptUri: ""
//			- iePreventClobber: false
//			- ieClobberMinimal: true
//			- locale: undefined
//			- extraLocale: undefined
//			- preventBackButtonFix: true
//			- searchIds: []
//			- parseWidgets: true
// TODOC: HOW TO DOC THESE VARIABLES?
// TODOC: IS THIS A COMPLETE LIST?
// note:
//		'djConfig' does not exist under 'dojo.*' so that it can be set before the
//		'dojo' variable exists.
// note:
//		Setting any of these variables *after* the library has loaded does nothing at all.
// TODOC: is this still true?  Release notes for 0.3 indicated they could be set after load.
//


//TODOC:  HOW TO DOC THIS?
// @global: dj_global
// summary:
//		an alias for the top-level global object in the host environment
//		(e.g., the window object in a browser).
// description:
//		Refer to 'dj_global' rather than referring to window to ensure your
//		code runs correctly in contexts other than web browsers (eg: Rhino on a server).
var dj_global = this;

//TODOC:  HOW TO DOC THIS?
// @global: dj_currentContext
// summary:
//		Private global context object. Where 'dj_global' always refers to the boot-time
//    global context, 'dj_currentContext' can be modified for temporary context shifting.
//    dojo.global() returns dj_currentContext.
// description:
//		Refer to dojo.global() rather than referring to dj_global to ensure your
//		code runs correctly in managed contexts.
var dj_currentContext = this;


// ****************************************************************
// global public utils
// TODOC: DO WE WANT TO NOTE THAT THESE ARE GLOBAL PUBLIC UTILS?
// ****************************************************************

function dj_undef(/*String*/ name, /*Object?*/ object){
	//summary: Returns true if 'name' is defined on 'object' (or globally if 'object' is null).
	//description: Note that 'defined' and 'exists' are not the same concept.
	return (typeof (object || dj_currentContext)[name] == "undefined");	// Boolean
}

// make sure djConfig is defined
if(dj_undef("djConfig", this)){
	var djConfig = {};
}

//TODOC:  HOW TO DOC THIS?
// dojo is the root variable of (almost all) our public symbols -- make sure it is defined.
if(dj_undef("dojo", this)){
	var dojo = {};
}

dojo.global = function(){
	// summary:
	//		return the current global context object
	//		(e.g., the window object in a browser).
	// description:
	//		Refer to 'dojo.global()' rather than referring to window to ensure your
	//		code runs correctly in contexts other than web browsers (eg: Rhino on a server).
	return dj_currentContext;
}

// Override locale setting, if specified
dojo.locale  = djConfig.locale;

//TODOC:  HOW TO DOC THIS?
dojo.version = {
	// summary: version number of this instance of dojo.
	major: 0, minor: 0, patch: 0, flag: "dev",
	revision: Number("$Rev: 6824 $".match(/[0-9]+/)[0]),
	toString: function(){
		with(dojo.version){
			return major + "." + minor + "." + patch + flag + " (" + revision + ")";	// String
		}
	}
}

dojo.evalProp = function(/*String*/ name, /*Object*/ object, /*Boolean?*/ create){
	// summary: Returns 'object[name]'.  If not defined and 'create' is true, will return a new Object.
	// description:
	//		Returns null if 'object[name]' is not defined and 'create' is not true.
	// 		Note: 'defined' and 'exists' are not the same concept.
	if((!object)||(!name)) return undefined; // undefined
	if(!dj_undef(name, object)) return object[name]; // mixed
	return (create ? (object[name]={}) : undefined);	// mixed
}

dojo.parseObjPath = function(/*String*/ path, /*Object?*/ context, /*Boolean?*/ create){
	// summary: Parse string path to an object, and return corresponding object reference and property name.
	// description:
	//		Returns an object with two properties, 'obj' and 'prop'.
	//		'obj[prop]' is the reference indicated by 'path'.
	// path: Path to an object, in the form "A.B.C".
	// context: Object to use as root of path.  Defaults to 'dojo.global()'.
	// create: If true, Objects will be created at any point along the 'path' that is undefined.
	var object = (context || dojo.global());
	var names = path.split('.');
	var prop = names.pop();
	for (var i=0,l=names.length;i<l && object;i++){
		object = dojo.evalProp(names[i], object, create);
	}
	return {obj: object, prop: prop};	// Object: {obj: Object, prop: String}
}

dojo.evalObjPath = function(/*String*/ path, /*Boolean?*/ create){
	// summary: Return the value of object at 'path' in the global scope, without using 'eval()'.
	// path: Path to an object, in the form "A.B.C".
	// create: If true, Objects will be created at any point along the 'path' that is undefined.
	if(typeof path != "string"){
		return dojo.global();
	}
	// fast path for no periods
	if(path.indexOf('.') == -1){
		return dojo.evalProp(path, dojo.global(), create);		// mixed
	}

	//MOW: old 'with' syntax was confusing and would throw an error if parseObjPath returned null.
	var ref = dojo.parseObjPath(path, dojo.global(), create);
	if(ref){
		return dojo.evalProp(ref.prop, ref.obj, create);	// mixed
	}
	return null;
}

dojo.errorToString = function(/*Error*/ exception){
	// summary: Return an exception's 'message', 'description' or text.

	// TODO: overriding Error.prototype.toString won't accomplish this?
 	// 		... since natively generated Error objects do not always reflect such things?
	if(!dj_undef("message", exception)){
		return exception.message;		// String
	}else if(!dj_undef("description", exception)){
		return exception.description;	// String
	}else{
		return exception;				// Error
	}
}

dojo.raise = function(/*String*/ message, /*Error?*/ exception){
	// summary: Common point for raising exceptions in Dojo to enable logging.
	//	Throws an error message with text of 'exception' if provided, or
	//	rethrows exception object.

	if(exception){
		message = message + ": "+dojo.errorToString(exception);
	}else{
		message = dojo.errorToString(message);
	}

	// print the message to the user if hostenv.println is defined
	try { if(djConfig.isDebug){ dojo.hostenv.println("FATAL exception raised: "+message); } } catch (e) {}

	throw exception || Error(message);
}

//Stub functions so things don't break.
//TODOC:  HOW TO DOC THESE?
dojo.debug = function(){};
dojo.debugShallow = function(obj){};
dojo.profile = { start: function(){}, end: function(){}, stop: function(){}, dump: function(){} };

function dj_eval(/*String*/ scriptFragment){
	// summary: Perform an evaluation in the global scope.  Use this rather than calling 'eval()' directly.
	// description: Placed in a separate function to minimize size of trapped evaluation context.
	// note:
	//	 - JSC eval() takes an optional second argument which can be 'unsafe'.
	//	 - Mozilla/SpiderMonkey eval() takes an optional second argument which is the
	//  	 scope object for new symbols.
	return dj_global.eval ? dj_global.eval(scriptFragment) : eval(scriptFragment); 	// mixed
}

dojo.unimplemented = function(/*String*/ funcname, /*String?*/ extra){
	// summary: Throw an exception because some function is not implemented.
	// extra: Text to append to the exception message.
	var message = "'" + funcname + "' not implemented";
	if (extra != null) { message += " " + extra; }
	dojo.raise(message);
}

dojo.deprecated = function(/*String*/ behaviour, /*String?*/ extra, /*String?*/ removal){
	// summary: Log a debug message to indicate that a behavior has been deprecated.
	// extra: Text to append to the message.
	// removal: Text to indicate when in the future the behavior will be removed.
	var message = "DEPRECATED: " + behaviour;
	if(extra){ message += " " + extra; }
	if(removal){ message += " -- will be removed in version: " + removal; }
	dojo.debug(message);
}

dojo.render = (function(){
	//TODOC: HOW TO DOC THIS?
	// summary: Details rendering support, OS and browser of the current environment.
	// TODOC: is this something many folks will interact with?  If so, we should doc the structure created...
	function vscaffold(prefs, names){
		var tmp = {
			capable: false,
			support: {
				builtin: false,
				plugin: false
			},
			prefixes: prefs
		};
		for(var i=0; i<names.length; i++){
			tmp[names[i]] = false;
		}
		return tmp;
	}

	return {
		name: "",
		ver: dojo.version,
		os: { win: false, linux: false, osx: false },
		html: vscaffold(["html"], ["ie", "opera", "khtml", "safari", "moz"]),
		svg: vscaffold(["svg"], ["corel", "adobe", "batik"]),
		vml: vscaffold(["vml"], ["ie"]),
		swf: vscaffold(["Swf", "Flash", "Mm"], ["mm"]),
		swt: vscaffold(["Swt"], ["ibm"])
	};
})();

// ****************************************************************
// dojo.hostenv methods that must be defined in hostenv_*.js
// ****************************************************************

/**
 * The interface definining the interaction with the EcmaScript host environment.
*/

/*
 * None of these methods should ever be called directly by library users.
 * Instead public methods such as loadModule should be called instead.
 */
dojo.hostenv = (function(){
	// TODOC:  HOW TO DOC THIS?
	// summary: Provides encapsulation of behavior that changes across different 'host environments'
	//			(different browsers, server via Rhino, etc).
	// description: None of these methods should ever be called directly by library users.
	//				Use public methods such as 'loadModule' instead.

	// default configuration options
	var config = {
		isDebug: false,
		allowQueryConfig: false,
		baseScriptUri: "",
		baseRelativePath: "",
		libraryScriptUri: "",
		iePreventClobber: false,
		ieClobberMinimal: true,
		preventBackButtonFix: true,
		delayMozLoadingFix: false,
		searchIds: [],
		parseWidgets: true
	};

	if (typeof djConfig == "undefined") { djConfig = config; }
	else {
		for (var option in config) {
			if (typeof djConfig[option] == "undefined") {
				djConfig[option] = config[option];
			}
		}
	}

	return {
		name_: '(unset)',
		version_: '(unset)',


		getName: function(){
			// sumary: Return the name of the host environment.
			return this.name_; 	// String
		},


		getVersion: function(){
			// summary: Return the version of the hostenv.
			return this.version_; // String
		},

		getText: function(/*String*/ uri){
			// summary:	Read the plain/text contents at the specified 'uri'.
			// description:
			//			If 'getText()' is not implemented, then it is necessary to override
			//			'loadUri()' with an implementation that doesn't rely on it.

			dojo.unimplemented('getText', "uri=" + uri);
		}
	};
})();


dojo.hostenv.getBaseScriptUri = function(){
	// summary: Return the base script uri that other scripts are found relative to.
	// TODOC: HUH?  This comment means nothing to me.  What other scripts? Is this the path to other dojo libraries?
	//		MAYBE:  Return the base uri to scripts in the dojo library.	 ???
	// return: Empty string or a path ending in '/'.
	if(djConfig.baseScriptUri.length){
		return djConfig.baseScriptUri;
	}

	// MOW: Why not:
	//			uri = djConfig.libraryScriptUri || djConfig.baseRelativePath
	//		??? Why 'new String(...)'
	var uri = new String(djConfig.libraryScriptUri||djConfig.baseRelativePath);
	if (!uri) { dojo.raise("Nothing returned by getLibraryScriptUri(): " + uri); }

	// MOW: uri seems to not be actually used.  Seems to be hard-coding to djConfig.baseRelativePath... ???
	var lastslash = uri.lastIndexOf('/');		// MOW ???
	djConfig.baseScriptUri = djConfig.baseRelativePath;
	return djConfig.baseScriptUri;	// String
}

/*
 * loader.js - A bootstrap module.  Runs before the hostenv_*.js file. Contains all of the package loading methods.
 */

//A semi-colon is at the start of the line because after doing a build, this function definition
//get compressed onto the same line as the last line in bootstrap1.js. That list line is just a
//curly bracket, and the browser complains about that syntax. The semicolon fixes it. Putting it
//here instead of at the end of bootstrap1.js, since it is more of an issue for this file, (using
//the closure), and bootstrap1.js could change in the future.
;(function(){
	//Additional properties for dojo.hostenv
	var _addHostEnv = {
		pkgFileName: "__package__",
	
		// for recursion protection
		loading_modules_: {},
		loaded_modules_: {},
		addedToLoadingCount: [],
		removedFromLoadingCount: [],
	
		inFlightCount: 0,
	
		// FIXME: it should be possible to pull module prefixes in from djConfig
		modulePrefixes_: {
			dojo: {name: "dojo", value: "src"}
		},

		setModulePrefix: function(/*String*/module, /*String*/prefix){
			// summary: establishes module/prefix pair
			this.modulePrefixes_[module] = {name: module, value: prefix};
		},

		moduleHasPrefix: function(/*String*/module){
			// summary: checks to see if module has been established
			var mp = this.modulePrefixes_;
			return Boolean(mp[module] && mp[module].value); // Boolean
		},

		getModulePrefix: function(/*String*/module){
			// summary: gets the prefix associated with module
			if(this.moduleHasPrefix(module)){
				return this.modulePrefixes_[module].value; // String
			}
			return module; // String
		},

		getTextStack: [],
		loadUriStack: [],
		loadedUris: [],
	
		//WARNING: This variable is referenced by packages outside of bootstrap: FloatingPane.js and undo/browser.js
		post_load_: false,
		
		//Egad! Lots of test files push on this directly instead of using dojo.addOnLoad.
		modulesLoadedListeners: [],
		unloadListeners: [],
		loadNotifying: false
	};
	
	//Add all of these properties to dojo.hostenv
	for(var param in _addHostEnv){
		dojo.hostenv[param] = _addHostEnv[param];
	}
})();

dojo.hostenv.loadPath = function(/*String*/relpath, /*String?*/module, /*Function?*/cb){
// summary:
//	Load a Javascript module given a relative path
//
// description:
//	Loads and interprets the script located at relpath, which is relative to the
//	script root directory.  If the script is found but its interpretation causes
//	a runtime exception, that exception is not caught by us, so the caller will
//	see it.  We return a true value if and only if the script is found.
//
//	For now, we do not have an implementation of a true search path.  We
//	consider only the single base script uri, as returned by getBaseScriptUri().
//
// relpath: A relative path to a script (no leading '/', and typically
// 	ending in '.js').
// module: A module whose existance to check for after loading a path.
//	Can be used to determine success or failure of the load.
// cb: a callback function to pass the result of evaluating the script

	var uri;
	if(relpath.charAt(0) == '/' || relpath.match(/^\w+:/)){
		// dojo.raise("relpath '" + relpath + "'; must be relative");
		uri = relpath;
	}else{
		uri = this.getBaseScriptUri() + relpath;
	}
	if(djConfig.cacheBust && dojo.render.html.capable){
		uri += "?" + String(djConfig.cacheBust).replace(/\W+/g,"");
	}
	try{
		return !module ? this.loadUri(uri, cb) : this.loadUriAndCheck(uri, module, cb); // Boolean
	}catch(e){
		dojo.debug(e);
		return false; // Boolean
	}
}

dojo.hostenv.loadUri = function(/*String (URL)*/uri, /*Function?*/cb){
// summary:
//	Loads JavaScript from a URI
//
// description:
//	Reads the contents of the URI, and evaluates the contents.  This is used to load modules as well
//	as resource bundles.  Returns true if it succeeded. Returns false if the URI reading failed.
//	Throws if the evaluation throws.
//
// uri: a uri which points at the script to be loaded
// cb: a callback function to process the result of evaluating the script as an expression, typically
//	used by the resource bundle loader to load JSON-style resources

	if(this.loadedUris[uri]){
		return true; // Boolean
	}
	var contents = this.getText(uri, null, true);
	if(!contents){ return false; } // Boolean
	this.loadedUris[uri] = true;
	if(cb){ contents = '('+contents+')'; }
	var value = dj_eval(contents);
	if(cb){ cb(value); }
	return true; // Boolean
}

// FIXME: probably need to add logging to this method
dojo.hostenv.loadUriAndCheck = function(/*String (URL)*/uri, /*String*/moduleName, /*Function?*/cb){
	// summary: calls loadUri then findModule and returns true if both succeed
	var ok = true;
	try{
		ok = this.loadUri(uri, cb);
	}catch(e){
		dojo.debug("failed loading ", uri, " with error: ", e);
	}
	return Boolean(ok && this.findModule(moduleName, false)); // Boolean
}

dojo.loaded = function(){ }
dojo.unloaded = function(){ }

dojo.hostenv.loaded = function(){
	this.loadNotifying = true;
	this.post_load_ = true;
	var mll = this.modulesLoadedListeners;
	for(var x=0; x<mll.length; x++){
		mll[x]();
	}

	//Clear listeners so new ones can be added
	//For other xdomain package loads after the initial load.
	this.modulesLoadedListeners = [];
	this.loadNotifying = false;

	dojo.loaded();
}

dojo.hostenv.unloaded = function(){
	var mll = this.unloadListeners;
	while(mll.length){
		(mll.pop())();
	}
	dojo.unloaded();
}

dojo.addOnLoad = function(/*Object?*/obj, /*String|Function*/functionName) {
// summary:
//	Registers a function to be triggered after the DOM has finished loading 
//	and widgets declared in markup have been instantiated.  Images and CSS files
//	may or may not have finished downloading when the specified function is called.
//	(Note that widgets' CSS and HTML code is guaranteed to be downloaded before said
//	widgets are instantiated.)
//
// usage:
//	dojo.addOnLoad(functionPointer)
//	dojo.addOnLoad(object, "functionName")

	var dh = dojo.hostenv;
	if(arguments.length == 1) {
		dh.modulesLoadedListeners.push(obj);
	} else if(arguments.length > 1) {
		dh.modulesLoadedListeners.push(function() {
			obj[functionName]();
		});
	}

	//Added for xdomain loading. dojo.addOnLoad is used to
	//indicate callbacks after doing some dojo.require() statements.
	//In the xdomain case, if all the requires are loaded (after initial
	//page load), then immediately call any listeners.
	if(dh.post_load_ && dh.inFlightCount == 0 && !dh.loadNotifying){
		dh.callLoaded();
	}
}

dojo.addOnUnload = function(/*Object?*/obj, /*String|Function?*/functionName){
// summary: registers a function to be triggered when the page unloads
//
// usage:
//	dojo.addOnLoad(functionPointer)
//	dojo.addOnLoad(object, "functionName")
	var dh = dojo.hostenv;
	if(arguments.length == 1){
		dh.unloadListeners.push(obj);
	} else if(arguments.length > 1) {
		dh.unloadListeners.push(function() {
			obj[functionName]();
		});
	}
}

dojo.hostenv.modulesLoaded = function(){
	if(this.post_load_){ return; }
	if(this.loadUriStack.length==0 && this.getTextStack.length==0){
		if(this.inFlightCount > 0){ 
			dojo.debug("files still in flight!");
			return;
		}
		dojo.hostenv.callLoaded();
	}
}

dojo.hostenv.callLoaded = function(){
	if(typeof setTimeout == "object"){
		setTimeout("dojo.hostenv.loaded();", 0);
	}else{
		dojo.hostenv.loaded();
	}
}

dojo.hostenv.getModuleSymbols = function(/*String*/modulename){
// summary:
//	Converts a module name in dotted JS notation to an array representing the path in the source tree
	var syms = modulename.split(".");
	for(var i = syms.length; i>0; i--){
		var parentModule = syms.slice(0, i).join(".");
		if((i==1) && !this.moduleHasPrefix(parentModule)){		
			// Support default module directory (sibling of dojo) for top-level modules 
			syms[0] = "../" + syms[0];
		}else{
			var parentModulePath = this.getModulePrefix(parentModule);
			if(parentModulePath != parentModule){
				syms.splice(0, i, parentModulePath);
				break;
			}
		}
	}
	return syms; // Array
}

dojo.hostenv._global_omit_module_check = false;
dojo.hostenv.loadModule = function(/*String*/moduleName, /*Boolean?*/exactOnly, /*Boolean?*/omitModuleCheck){
// summary:
//	loads a Javascript module from the appropriate URI
//
// description:
//	loadModule("A.B") first checks to see if symbol A.B is defined. 
//	If it is, it is simply returned (nothing to do).
//	
//	If it is not defined, it will look for "A/B.js" in the script root directory,
//	followed by "A.js".
//	
//	It throws if it cannot find a file to load, or if the symbol A.B is not
//	defined after loading.
//	
//	It returns the object A.B.
//	
//	This does nothing about importing symbols into the current package.
//	It is presumed that the caller will take care of that. For example, to import
//	all symbols:
//	
//	   with (dojo.hostenv.loadModule("A.B")) {
//	      ...
//	   }
//	
//	And to import just the leaf symbol:
//	
//	   var B = dojo.hostenv.loadModule("A.B");
//	   ...
//	
//	dj_load is an alias for dojo.hostenv.loadModule

	if(!moduleName){ return; }
	omitModuleCheck = this._global_omit_module_check || omitModuleCheck;
	var module = this.findModule(moduleName, false);
	if(module){
		return module;
	}

	// protect against infinite recursion from mutual dependencies
	if(dj_undef(moduleName, this.loading_modules_)){
		this.addedToLoadingCount.push(moduleName);
	}
	this.loading_modules_[moduleName] = 1;

	// convert periods to slashes
	var relpath = moduleName.replace(/\./g, '/') + '.js';

	var nsyms = moduleName.split(".");
	
	// this line allowed loading of a module manifest as if it were a namespace
	// it's an interesting idea, but shouldn't be combined with 'namespaces' proper
	// and leads to unwanted dependencies
	// the effect can be achieved in other (albeit less-flexible) ways now, so I am
	// removing this pending further design work
	// perhaps we can explicitly define this idea of a 'module manifest', and subclass
	// 'namespace manifest' from that
	//dojo.getNamespace(nsyms[0]);

	var syms = this.getModuleSymbols(moduleName);
	var startedRelative = ((syms[0].charAt(0) != '/') && !syms[0].match(/^\w+:/));
	var last = syms[syms.length - 1];
	var ok;
	// figure out if we're looking for a full package, if so, we want to do
	// things slightly diffrently
	if(last=="*"){
		moduleName = nsyms.slice(0, -1).join('.');
		while(syms.length){
			syms.pop();
			syms.push(this.pkgFileName);
			relpath = syms.join("/") + '.js';
			if(startedRelative && relpath.charAt(0)=="/"){
				relpath = relpath.slice(1);
			}
			ok = this.loadPath(relpath, !omitModuleCheck ? moduleName : null);
			if(ok){ break; }
			syms.pop();
		}
	}else{
		relpath = syms.join("/") + '.js';
		moduleName = nsyms.join('.');
		var modArg = !omitModuleCheck ? moduleName : null;
		ok = this.loadPath(relpath, modArg);
		if(!ok && !exactOnly){
			syms.pop();
			while(syms.length){
				relpath = syms.join('/') + '.js';
				ok = this.loadPath(relpath, modArg);
				if(ok){ break; }
				syms.pop();
				relpath = syms.join('/') + '/'+this.pkgFileName+'.js';
				if(startedRelative && relpath.charAt(0)=="/"){
					relpath = relpath.slice(1);
				}
				ok = this.loadPath(relpath, modArg);
				if(ok){ break; }
			}
		}

		if(!ok && !omitModuleCheck){
			dojo.raise("Could not load '" + moduleName + "'; last tried '" + relpath + "'");
		}
	}

	// check that the symbol was defined
	//Don't bother if we're doing xdomain (asynchronous) loading.
	if(!omitModuleCheck && !this["isXDomain"]){
		// pass in false so we can give better error
		module = this.findModule(moduleName, false);
		if(!module){
			dojo.raise("symbol '" + moduleName + "' is not defined after loading '" + relpath + "'"); 
		}
	}

	return module;
}

dojo.hostenv.startPackage = function(/*String*/packageName){
// summary:
//	Creates a JavaScript package
//
// description:
//	startPackage("A.B") follows the path, and at each level creates a new empty
//	object or uses what already exists. It returns the result.
//
// packageName: the package to be created as a String in dot notation

	//Make sure we have a string.
	var fullPkgName = String(packageName);
	var strippedPkgName = fullPkgName;

	var syms = packageName.split(/\./);
	if(syms[syms.length-1]=="*"){
		syms.pop();
		strippedPkgName = syms.join(".");
	}
	var evaledPkg = dojo.evalObjPath(strippedPkgName, true);
	this.loaded_modules_[fullPkgName] = evaledPkg;
	this.loaded_modules_[strippedPkgName] = evaledPkg;
	
	return evaledPkg; // Object
}

dojo.hostenv.findModule = function(/*String*/moduleName, /*Boolean?*/mustExist){
// summary:
//	Returns the Object representing the module, if it exists, otherwise null.
//
// moduleName A fully qualified module including package name, like 'A.B'.
// mustExist Optional, default false. throw instead of returning null
//	if the module does not currently exist.

	var lmn = String(moduleName);

	if(this.loaded_modules_[lmn]){
		return this.loaded_modules_[lmn]; // Object
	}

	if(mustExist){
		dojo.raise("no loaded module named '" + moduleName + "'");
	}
	return null; // null
}

//Start of old bootstrap2:

dojo.kwCompoundRequire = function(/*Object containing Arrays*/modMap){
// description:
//	This method taks a "map" of arrays which one can use to optionally load dojo
//	modules. The map is indexed by the possible dojo.hostenv.name_ values, with
//	two additional values: "default" and "common". The items in the "default"
//	array will be loaded if none of the other items have been choosen based on
//	the hostenv.name_ item. The items in the "common" array will _always_ be
//	loaded, regardless of which list is chosen.  Here's how it's normally
//	called:
//	
//	dojo.kwCompoundRequire({
//		browser: [
//			["foo.bar.baz", true, true], // an example that passes multiple args to loadModule()
//			"foo.sample.*",
//			"foo.test,
//		],
//		default: [ "foo.sample.*" ],
//		common: [ "really.important.module.*" ]
//	});

	var common = modMap["common"]||[];
	var result = modMap[dojo.hostenv.name_] ? common.concat(modMap[dojo.hostenv.name_]||[]) : common.concat(modMap["default"]||[]);

	for(var x=0; x<result.length; x++){
		var curr = result[x];
		if(curr.constructor == Array){
			dojo.hostenv.loadModule.apply(dojo.hostenv, curr);
		}else{
			dojo.hostenv.loadModule(curr);
		}
	}
}

dojo.require = function(/*String*/ resourceName){
	// summary
	//	Ensure that the given resource (ie, javascript
	//	source file) has been loaded.
	// description
	//	dojo.require() is similar to C's #include command or java's "import" command.
	//	You call dojo.require() to pull in the resources (ie, javascript source files)
	//	that define the functions you are using. 
	//
	//	Note that in the case of a build, many resources have already been included
	//	into dojo.js (ie, many of the javascript source files have been compressed and
	//	concatened into dojo.js), so many dojo.require() calls will simply return
	//	without downloading anything.
	dojo.hostenv.loadModule.apply(dojo.hostenv, arguments);
}

dojo.requireIf = function(/*Boolean*/ condition, /*String*/ resourceName){
	// summary
	//	If the condition is true then call dojo.require() for the specified resource
	var arg0 = arguments[0];
	if((arg0 === true)||(arg0=="common")||(arg0 && dojo.render[arg0].capable)){
		var args = [];
		for (var i = 1; i < arguments.length; i++) { args.push(arguments[i]); }
		dojo.require.apply(dojo, args);
	}
}

dojo.requireAfterIf = dojo.requireIf;

dojo.provide = function(/*String*/ resourceName){
	// summary
	//	Each javascript source file must have (exactly) one dojo.provide()
	//	call at the top of the file, corresponding to the file name.
	//	For example, dojo/src/foo.js must have dojo.provide("dojo.foo"); at the top of the file.
	//
	// description
	//	Each javascript source file is called a resource.  When a resource
	//	is loaded by the browser, dojo.provide() registers that it has
	//	been loaded.
	//	
	//	For backwards compatibility reasons, in addition to registering the resource,
	//	dojo.provide() also ensures that the javascript object for the module exists.  For
	//	example, dojo.provide("dojo.html.common"), in addition to registering that common.js
	//	is a resource for the dojo.html module, will ensure that the dojo.html javascript object
	//	exists, so that calls like dojo.html.foo = function(){ ... } don't fail.
	//
	//	In the case of a build (or in the future, a rollup), where multiple javascript source
	//	files are combined into one bigger file (similar to a .lib or .jar file), that file
	//	will contain multiple dojo.provide() calls, to note that it includes
	//	multiple resources.
	return dojo.hostenv.startPackage.apply(dojo.hostenv, arguments);
}

dojo.registerModulePath = function(/*String*/module, /*String*/prefix){
	// summary: maps a module name to a path
	// description: An unregistered module is given the default path of ../<module>,
	//	relative to Dojo root. For example, module acme is mapped to ../acme.
	//	If you want to use a different module name, use dojo.registerModulePath. 
	return dojo.hostenv.setModulePrefix(module, prefix);
}

dojo.setModulePrefix = function(/*String*/module, /*String*/prefix){
	// summary: maps a module name to a path
	dojo.deprecated('dojo.setModulePrefix("' + module + '", "' + prefix + '")', "replaced by dojo.registerModulePath", "0.5");
	return dojo.registerModulePath(module, prefix);
}

dojo.exists = function(/*Object*/obj, /*String*/name){
	// summary: determine if an object supports a given method
	// description: useful for longer api chains where you have to test each object in the chain
	var p = name.split(".");
	for(var i = 0; i < p.length; i++){
		if(!obj[p[i]]){ return false; } // Boolean
		obj = obj[p[i]];
	}
	return true; // Boolean
}

// Localization routines

dojo.hostenv.normalizeLocale = function(/*String?*/locale){
//	summary:
//		Returns canonical form of locale, as used by Dojo.  All variants are case-insensitive and are separated by '-'
//		as specified in RFC 3066. If no locale is specified, the user agent's default is returned.

	var result = locale ? locale.toLowerCase() : dojo.locale;
	if(result == "root"){
		result = "ROOT";
	}
	return result;// String
};

dojo.hostenv.searchLocalePath = function(/*String*/locale, /*Boolean*/down, /*Function*/searchFunc){
//	summary:
//		A helper method to assist in searching for locale-based resources.  Will iterate through
//		the variants of a particular locale, either up or down, executing a callback function.
//		For example, "en-us" and true will try "en-us" followed by "en" and finally "ROOT".

	locale = dojo.hostenv.normalizeLocale(locale);

	var elements = locale.split('-');
	var searchlist = [];
	for(var i = elements.length; i > 0; i--){
		searchlist.push(elements.slice(0, i).join('-'));
	}
	searchlist.push(false);
	if(down){searchlist.reverse();}

	for(var j = searchlist.length - 1; j >= 0; j--){
		var loc = searchlist[j] || "ROOT";
		var stop = searchFunc(loc);
		if(stop){ break; }
	}
}

//These two functions are placed outside of preloadLocalizations
//So that the xd loading can use/override them.
dojo.hostenv.localesGenerated /***BUILD:localesGenerated***/; // value will be inserted here at build time, if necessary

dojo.hostenv.registerNlsPrefix = function(){
// summary:
//	Register module "nls" to point where Dojo can find pre-built localization files
	dojo.registerModulePath("nls","nls");	
}

dojo.hostenv.preloadLocalizations = function(){
// summary:
//	Load built, flattened resource bundles, if available for all locales used in the page.
//	Execute only once.  Note that this is a no-op unless there is a build.

	if(dojo.hostenv.localesGenerated){
		dojo.hostenv.registerNlsPrefix();

		function preload(locale){
			locale = dojo.hostenv.normalizeLocale(locale);
			dojo.hostenv.searchLocalePath(locale, true, function(loc){
				for(var i=0; i<dojo.hostenv.localesGenerated.length;i++){
					if(dojo.hostenv.localesGenerated[i] == loc){
						dojo["require"]("nls.dojo_"+loc);
						return true; // Boolean
					}
				}
				return false; // Boolean
			});
		}
		preload();
		var extra = djConfig.extraLocale||[];
		for(var i=0; i<extra.length; i++){
			preload(extra[i]);
		}
	}
	dojo.hostenv.preloadLocalizations = function(){};
}

dojo.requireLocalization = function(/*String*/moduleName, /*String*/bundleName, /*String?*/locale, /*String?*/availableFlatLocales){
// summary:
//	Declares translated resources and loads them if necessary, in the same style as dojo.require.
//	Contents of the resource bundle are typically strings, but may be any name/value pair,
//	represented in JSON format.  See also dojo.i18n.getLocalization.
//
// moduleName: name of the package containing the "nls" directory in which the bundle is found
// bundleName: bundle name, i.e. the filename without the '.js' suffix
// locale: the locale to load (optional)  By default, the browser's user locale as defined by dojo.locale
// availableFlatLocales: A comma-separated list of the available, flattened locales for this bundle.
// This argument should only be set by the build process.
//
// description:
//	Load translated resource bundles provided underneath the "nls" directory within a package.
//	Translated resources may be located in different packages throughout the source tree.  For example,
//	a particular widget may define one or more resource bundles, structured in a program as follows,
//	where moduleName is mycode.mywidget and bundleNames available include bundleone and bundletwo:
//	...
//	mycode/
//	 mywidget/
//	  nls/
//	   bundleone.js (the fallback translation, English in this example)
//	   bundletwo.js (also a fallback translation)
//	   de/
//	    bundleone.js
//	    bundletwo.js
//	   de-at/
//	    bundleone.js
//	   en/
//	    (empty; use the fallback translation)
//	   en-us/
//	    bundleone.js
//	   en-gb/
//	    bundleone.js
//	   es/
//	    bundleone.js
//	    bundletwo.js
//	  ...etc
//	...
//	Each directory is named for a locale as specified by RFC 3066, (http://www.ietf.org/rfc/rfc3066.txt),
//	normalized in lowercase.  Note that the two bundles in the example do not define all the same variants.
//	For a given locale, bundles will be loaded for that locale and all more general locales above it, including
//	a fallback at the root directory.  For example, a declaration for the "de-at" locale will first
//	load nls/de-at/bundleone.js, then nls/de/bundleone.js and finally nls/bundleone.js.  The data will
//	be flattened into a single Object so that lookups will follow this cascading pattern.  An optional build
//	step can preload the bundles to avoid data redundancy and the multiple network hits normally required to
//	load these resources.

	dojo.hostenv.preloadLocalizations();
	var targetLocale = dojo.hostenv.normalizeLocale(locale);
 	var bundlePackage = [moduleName, "nls", bundleName].join(".");
//NOTE: When loading these resources, the packaging does not match what is on disk.  This is an
// implementation detail, as this is just a private data structure to hold the loaded resources.
// e.g. tests/hello/nls/en-us/salutations.js is loaded as the object tests.hello.nls.salutations.en_us={...}
// The structure on disk is intended to be most convenient for developers and translators, but in memory
// it is more logical and efficient to store in a different order.  Locales cannot use dashes, since the
// resulting path will not evaluate as valid JS, so we translate them to underscores.
	
	//Find the best-match locale to load if we have available flat locales.
	var bestLocale = "";
	if(availableFlatLocales){
		var flatLocales = availableFlatLocales.split(",");
		for(var i = 0; i < flatLocales.length; i++){
			//Locale must match from start of string.
			if(targetLocale.indexOf(flatLocales[i]) == 0){
				if(flatLocales[i].length > bestLocale.length){
					bestLocale = flatLocales[i];
				}
			}
		}
		if(!bestLocale){
			bestLocale = "ROOT";
		}		
	}

	//See if the desired locale is already loaded.
	var tempLocale = availableFlatLocales ? bestLocale : targetLocale;
	var bundle = dojo.hostenv.findModule(bundlePackage);
	var localizedBundle = null;
	if(bundle){
		if(djConfig.localizationComplete && bundle._built){return;}
		var jsLoc = tempLocale.replace('-', '_');
		var translationPackage = bundlePackage+"."+jsLoc;
		localizedBundle = dojo.hostenv.findModule(translationPackage);
	}

	if(!localizedBundle){
		bundle = dojo.hostenv.startPackage(bundlePackage);
		var syms = dojo.hostenv.getModuleSymbols(moduleName);
		var modpath = syms.concat("nls").join("/");
		var parent;

		dojo.hostenv.searchLocalePath(tempLocale, availableFlatLocales, function(loc){
			var jsLoc = loc.replace('-', '_');
			var translationPackage = bundlePackage + "." + jsLoc;
			var loaded = false;
			if(!dojo.hostenv.findModule(translationPackage)){
				// Mark loaded whether it's found or not, so that further load attempts will not be made
				dojo.hostenv.startPackage(translationPackage);
				var module = [modpath];
				if(loc != "ROOT"){module.push(loc);}
				module.push(bundleName);
				var filespec = module.join("/") + '.js';
				loaded = dojo.hostenv.loadPath(filespec, null, function(hash){
					// Use singleton with prototype to point to parent bundle, then mix-in result from loadPath
					var clazz = function(){};
					clazz.prototype = parent;
					bundle[jsLoc] = new clazz();
					for(var j in hash){ bundle[jsLoc][j] = hash[j]; }
				});
			}else{
				loaded = true;
			}
			if(loaded && bundle[jsLoc]){
				parent = bundle[jsLoc];
			}else{
				bundle[jsLoc] = parent;
			}
			
			if(availableFlatLocales){
				//Stop the locale path searching if we know the availableFlatLocales, since
				//the first call to this function will load the only bundle that is needed.
				return true;
			}
		});
	}

	//Save the best locale bundle as the target locale bundle when we know the
	//the available bundles.
	if(availableFlatLocales && targetLocale != bestLocale){
		bundle[targetLocale.replace('-', '_')] = bundle[bestLocale.replace('-', '_')];
	}
};

(function(){
	// If other locales are used, dojo.requireLocalization should load them as well, by default.
	// Override dojo.requireLocalization to do load the default bundle, then iterate through the
	// extraLocale list and load those translations as well, unless a particular locale was requested.

	var extra = djConfig.extraLocale;
	if(extra){
		if(!extra instanceof Array){
			extra = [extra];
		}

		var req = dojo.requireLocalization;
		dojo.requireLocalization = function(m, b, locale, availableFlatLocales){
			req(m,b,locale, availableFlatLocales);
			if(locale){return;}
			for(var i=0; i<extra.length; i++){
				req(m,b,extra[i], availableFlatLocales);
			}
		};
	}
})();

};

if(typeof window != 'undefined'){

	// attempt to figure out the path to dojo if it isn't set in the config
	(function(){
		// before we get any further with the config options, try to pick them out
		// of the URL. Most of this code is from NW
		if(djConfig.allowQueryConfig){
			var baseUrl = document.location.toString(); // FIXME: use location.query instead?
			var params = baseUrl.split("?", 2);
			if(params.length > 1){
				var paramStr = params[1];
				var pairs = paramStr.split("&");
				for(var x in pairs){
					var sp = pairs[x].split("=");
					// FIXME: is this eval dangerous?
					if((sp[0].length > 9)&&(sp[0].substr(0, 9) == "djConfig.")){
						var opt = sp[0].substr(9);
						try{
							djConfig[opt]=eval(sp[1]);
						}catch(e){
							djConfig[opt]=sp[1];
						}
					}
				}
			}
		}

		if(
			((djConfig["baseScriptUri"] == "")||(djConfig["baseRelativePath"] == "")) && 
			(document && document.getElementsByTagName)
		){
			var scripts = document.getElementsByTagName("script");
			var rePkg = /(__package__|dojo|bootstrap1)\.js([\?\.]|$)/i;
			for(var i = 0; i < scripts.length; i++) {
				var src = scripts[i].getAttribute("src");
				if(!src) { continue; }
				var m = src.match(rePkg);
				if(m) {
					var root = src.substring(0, m.index);
					if(src.indexOf("bootstrap1") > -1) { root += "../"; }
					if(!this["djConfig"]) { djConfig = {}; }
					if(djConfig["baseScriptUri"] == "") { djConfig["baseScriptUri"] = root; }
					if(djConfig["baseRelativePath"] == "") { djConfig["baseRelativePath"] = root; }
					break;
				}
			}
		}

		// fill in the rendering support information in dojo.render.*
		var dr = dojo.render;
		var drh = dojo.render.html;
		var drs = dojo.render.svg;
		var dua = (drh.UA = navigator.userAgent);
		var dav = (drh.AV = navigator.appVersion);
		var t = true;
		var f = false;
		drh.capable = t;
		drh.support.builtin = t;

		dr.ver = parseFloat(drh.AV);
		dr.os.mac = dav.indexOf("Macintosh") >= 0;
		dr.os.win = dav.indexOf("Windows") >= 0;
		// could also be Solaris or something, but it's the same browser
		dr.os.linux = dav.indexOf("X11") >= 0;

		drh.opera = dua.indexOf("Opera") >= 0;
		drh.khtml = (dav.indexOf("Konqueror") >= 0)||(dav.indexOf("Safari") >= 0);
		drh.safari = dav.indexOf("Safari") >= 0;
		var geckoPos = dua.indexOf("Gecko");
		drh.mozilla = drh.moz = (geckoPos >= 0)&&(!drh.khtml);
		if (drh.mozilla) {
			// gecko version is YYYYMMDD
			drh.geckoVersion = dua.substring(geckoPos + 6, geckoPos + 14);
		}
		drh.ie = (document.all)&&(!drh.opera);
		drh.ie50 = drh.ie && dav.indexOf("MSIE 5.0")>=0;
		drh.ie55 = drh.ie && dav.indexOf("MSIE 5.5")>=0;
		drh.ie60 = drh.ie && dav.indexOf("MSIE 6.0")>=0;
		drh.ie70 = drh.ie && dav.indexOf("MSIE 7.0")>=0;

		var cm = document["compatMode"];
		drh.quirks = (cm == "BackCompat")||(cm == "QuirksMode")||drh.ie55||drh.ie50;

		// TODO: is the HTML LANG attribute relevant?
		dojo.locale = dojo.locale || (drh.ie ? navigator.userLanguage : navigator.language).toLowerCase();

		dr.vml.capable=drh.ie;
		drs.capable = f;
		drs.support.plugin = f;
		drs.support.builtin = f;
		var tdoc = window["document"];
		var tdi = tdoc["implementation"];

		if((tdi)&&(tdi["hasFeature"])&&(tdi.hasFeature("org.w3c.dom.svg", "1.0"))){
			drs.capable = t;
			drs.support.builtin = t;
			drs.support.plugin = f;
		}
		// webkits after 420 support SVG natively. The test string is "AppleWebKit/420+"
		if(drh.safari){
			var tmp = dua.split("AppleWebKit/")[1];
			var ver = parseFloat(tmp.split(" ")[0]);
			if(ver >= 420){
				drs.capable = t;
				drs.support.builtin = t;
				drs.support.plugin = f;
			}
		}else{
		}
	})();

	dojo.hostenv.startPackage("dojo.hostenv");

	dojo.render.name = dojo.hostenv.name_ = 'browser';
	dojo.hostenv.searchIds = [];

	// These are in order of decreasing likelihood; this will change in time.
	dojo.hostenv._XMLHTTP_PROGIDS = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];

	dojo.hostenv.getXmlhttpObject = function(){
		// summary: does the work of portably generating a new XMLHTTPRequest object.
		var http = null;
		var last_e = null;
		try{ http = new XMLHttpRequest(); }catch(e){}
		if(!http){
			for(var i=0; i<3; ++i){
				var progid = dojo.hostenv._XMLHTTP_PROGIDS[i];
				try{
					http = new ActiveXObject(progid);
				}catch(e){
					last_e = e;
				}

				if(http){
					dojo.hostenv._XMLHTTP_PROGIDS = [progid];  // so faster next time
					break;
				}
			}

			/*if(http && !http.toString) {
				http.toString = function() { "[object XMLHttpRequest]"; }
			}*/
		}

		if(!http){
			return dojo.raise("XMLHTTP not available", last_e);
		}

		return http; // XMLHTTPRequest instance
	}

	dojo.hostenv._blockAsync = false;
	dojo.hostenv.getText = function(uri, async_cb, fail_ok){
		// summary: Read the contents of the specified uri and return those contents.
		// uri:
		//		A relative or absolute uri. If absolute, it still must be in
		//		the same "domain" as we are.
		// async_cb:
		//		If not specified, load synchronously. If specified, load
		//		asynchronously, and use async_cb as the progress handler which
		//		takes the xmlhttp object as its argument. If async_cb, this
		//		function returns null.
		// fail_ok:
		//		Default false. If fail_ok and !async_cb and loading fails,
		//		return null instead of throwing.

		// need to block async callbacks from snatching this thread as the result
		// of an async callback might call another sync XHR, this hangs khtml forever
		// hostenv._blockAsync must also be checked in BrowserIO's watchInFlight()
		// NOTE: must be declared before scope switches ie. this.getXmlhttpObject()
		if(!async_cb){ this._blockAsync = true; }

		var http = this.getXmlhttpObject();

		function isDocumentOk(http){
			var stat = http["status"];
			// allow a 304 use cache, needed in konq (is this compliant with the http spec?)
			return Boolean((!stat)||((200 <= stat)&&(300 > stat))||(stat==304));
		}

		if(async_cb){
			var _this = this, timer = null, gbl = dojo.global();
			var xhr = dojo.evalObjPath("dojo.io.XMLHTTPTransport");
			http.onreadystatechange = function(){
				if(timer){ gbl.clearTimeout(timer); timer = null; }
				if(_this._blockAsync || (xhr && xhr._blockAsync)){
					timer = gbl.setTimeout(function () { http.onreadystatechange.apply(this); }, 10);
				}else{
					if(4==http.readyState){
						if(isDocumentOk(http)){
							// dojo.debug("LOADED URI: "+uri);
							async_cb(http.responseText);
						}
					}
				}
			}
		}

		http.open('GET', uri, async_cb ? true : false);
		try{
			http.send(null);
			if(async_cb){
				return null;
			}
			if(!isDocumentOk(http)){
				var err = Error("Unable to load "+uri+" status:"+ http.status);
				err.status = http.status;
				err.responseText = http.responseText;
				throw err;
			}
		}catch(e){
			this._blockAsync = false;
			if((fail_ok)&&(!async_cb)){
				return null;
			}else{
				throw e;
			}
		}

		this._blockAsync = false;
		return http.responseText; // String
	}

	dojo.hostenv.defaultDebugContainerId = 'dojoDebug';
	dojo.hostenv._println_buffer = [];
	dojo.hostenv._println_safe = false;
	dojo.hostenv.println = function(/*String*/line){
		// summary:
		//		prints the provided line to whatever logging container is
		//		available. If the page isn't loaded yet, the line may be added
		//		to a buffer for printing later.
		if(!dojo.hostenv._println_safe){
			dojo.hostenv._println_buffer.push(line);
		}else{
			try {
				var console = document.getElementById(djConfig.debugContainerId ?
					djConfig.debugContainerId : dojo.hostenv.defaultDebugContainerId);
				if(!console) { console = dojo.body(); }

				var div = document.createElement("div");
				div.appendChild(document.createTextNode(line));
				console.appendChild(div);
			} catch (e) {
				try{
					// safari needs the output wrapped in an element for some reason
					document.write("<div>" + line + "</div>");
				}catch(e2){
					window.status = line;
				}
			}
		}
	}

	dojo.addOnLoad(function(){
		dojo.hostenv._println_safe = true;
		while(dojo.hostenv._println_buffer.length > 0){
			dojo.hostenv.println(dojo.hostenv._println_buffer.shift());
		}
	});

	function dj_addNodeEvtHdlr(/*DomNode*/node, /*String*/evtName, /*Function*/fp){
		// summary:
		//		non-destructively adds the specified function to the node's
		//		evtName handler.
		// node: the DomNode to add the handler to
		// evtName: should be in the form "click" for "onclick" handlers
		var oldHandler = node["on"+evtName] || function(){};
		node["on"+evtName] = function(){
			fp.apply(node, arguments);
			oldHandler.apply(node, arguments);
		}
		return true;
	}

	//	BEGIN DOMContentLoaded, from Dean Edwards (http://dean.edwards.name/weblog/2006/06/again/)
	function dj_load_init(e){
		// allow multiple calls, only first one will take effect
		// A bug in khtml calls events callbacks for document for event which isnt supported
		// for example a created contextmenu event calls DOMContentLoaded, workaround
		var type = (e && e.type) ? e.type.toLowerCase() : "load";
		if(arguments.callee.initialized || (type!="domcontentloaded" && type!="load")){ return; }
		arguments.callee.initialized = true;
		if(typeof(_timer) != 'undefined'){
			clearInterval(_timer);
			delete _timer;
		}

		var initFunc = function(){
			//perform initialization
			if(dojo.render.html.ie){
				dojo.hostenv.makeWidgets();
			}
		};

		if(dojo.hostenv.inFlightCount == 0){
			initFunc();
			dojo.hostenv.modulesLoaded();
		}else{
			//This else case should be xdomain loading.
			//Make sure this is the first thing in the load listener array.
			//Part of the dojo.addOnLoad guarantee is that when the listeners are notified,
			//It means the DOM (or page) has loaded and that widgets have been parsed.
			dojo.hostenv.modulesLoadedListeners.unshift(initFunc);
		}
	}

	//	START DOMContentLoaded
	// Mozilla and Opera 9 expose the event we could use
	if(document.addEventListener){
		if(dojo.render.html.opera || (dojo.render.html.moz && !djConfig.delayMozLoadingFix)){
			document.addEventListener("DOMContentLoaded", dj_load_init, null);
		}

		//	mainly for Opera 8.5, won't be fired if DOMContentLoaded fired already.
		//  also used for Mozilla because of trac #1640
		window.addEventListener("load", dj_load_init, null);
	}

	// 	for Internet Explorer. readyState will not be achieved on init call, but dojo doesn't need it
	//	however, we'll include it because we don't know if there are other functions added that might.
	//	Note that this has changed because the build process strips all comments--including conditional
	//		ones.
	if(dojo.render.html.ie && dojo.render.os.win){
		document.attachEvent("onreadystatechange", function(e){
			if(document.readyState == "complete"){
				dj_load_init();
			}
		});
	}

	if (/(WebKit|khtml)/i.test(navigator.userAgent)) { // sniff
		var _timer = setInterval(function() {
			if (/loaded|complete/.test(document.readyState)) {
				dj_load_init(); // call the onload handler
			}
		}, 10);
	}
	//	END DOMContentLoaded

	// IE WebControl hosted in an application can fire "beforeunload" and "unload"
	// events when control visibility changes, causing Dojo to unload too soon. The
	// following code fixes the problem
	// Reference: http://support.microsoft.com/default.aspx?scid=kb;en-us;199155
	if(dojo.render.html.ie){
		dj_addNodeEvtHdlr(window, "beforeunload", function(){
			dojo.hostenv._unloading = true;
			window.setTimeout(function() {
				dojo.hostenv._unloading = false;
			}, 0);
		});
	}

	dj_addNodeEvtHdlr(window, "unload", function(){
		dojo.hostenv.unloaded();
		if((!dojo.render.html.ie)||(dojo.render.html.ie && dojo.hostenv._unloading)){
			dojo.hostenv.unloaded();
		}
	});

	dojo.hostenv.makeWidgets = function(){
		// you can put searchIds in djConfig and dojo.hostenv at the moment
		// we should probably eventually move to one or the other
		var sids = [];
		if(djConfig.searchIds && djConfig.searchIds.length > 0) {
			sids = sids.concat(djConfig.searchIds);
		}
		if(dojo.hostenv.searchIds && dojo.hostenv.searchIds.length > 0) {
			sids = sids.concat(dojo.hostenv.searchIds);
		}

		if((djConfig.parseWidgets)||(sids.length > 0)){
			if(dojo.evalObjPath("dojo.widget.Parse")){
				// we must do this on a delay to avoid:
				//	http://www.shaftek.org/blog/archives/000212.html
				// (IE bug)
					var parser = new dojo.xml.Parse();
					if(sids.length > 0){
						for(var x=0; x<sids.length; x++){
							var tmpNode = document.getElementById(sids[x]);
							if(!tmpNode){ continue; }
							var frag = parser.parseElement(tmpNode, null, true);
							dojo.widget.getParser().createComponents(frag);
						}
					}else if(djConfig.parseWidgets){
						var frag  = parser.parseElement(dojo.body(), null, true);
						dojo.widget.getParser().createComponents(frag);
					}
			}
		}
	}

	dojo.addOnLoad(function(){
		if(!dojo.render.html.ie) {
			dojo.hostenv.makeWidgets();
		}
	});

	try{
		if(dojo.render.html.ie){
			document.namespaces.add("v","urn:schemas-microsoft-com:vml");
			document.createStyleSheet().addRule("v\\:*", "behavior:url(#default#VML)");
		}
	}catch(e){ }

	// stub, over-ridden by debugging code. This will at least keep us from
	// breaking when it's not included
	dojo.hostenv.writeIncludes = function(){}

	//TODOC:  HOW TO DOC THIS?
	// @global: dj_currentDocument
	// summary:
	//		Current document object. 'dj_currentDocument' can be modified for temporary context shifting.
	// description:
	//    dojo.doc() returns dojo.currentDocument.
	//		Refer to dojo.doc() rather than referring to 'window.document' to ensure your
	//		code runs correctly in managed contexts.
	if(!dj_undef("document", this)){
		dj_currentDocument = this.document;
	}

	dojo.doc = function(){
		// summary:
		//		return the document object associated with the dojo.global()
		return dj_currentDocument;
	}

	dojo.body = function(){
		// summary:
		//		return the body object associated with dojo.doc()
		// Note: document.body is not defined for a strict xhtml document
		return dojo.doc().body || dojo.doc().getElementsByTagName("body")[0];
	}

	dojo.byId = function(/*String*/id, /*DocumentElement*/doc){
		// summary:
		// 		similar to other library's "$" function, takes a string
		// 		representing a DOM id or a DomNode and returns the
		// 		corresponding DomNode. If a Node is passed, this function is a
		// 		no-op. Returns a single DOM node or null, working around
		// 		several browser-specific bugs to do so.
		// id: DOM id or DOM Node
		// doc:
		//		optional, defaults to the current value of dj_currentDocument.
		//		Can be used to retreive node references from other documents.
		if((id)&&((typeof id == "string")||(id instanceof String))){
			if(!doc){ doc = dj_currentDocument; }
			var ele = doc.getElementById(id);
			// workaround bug in IE and Opera 8.2 where getElementById returns wrong element
			if(ele && (ele.id != id) && doc.all){
				ele = null;
				// get all matching elements with this id
				eles = doc.all[id];
				if(eles){
					// if more than 1, choose first with the correct id
					if(eles.length){
						for(var i=0; i<eles.length; i++){
							if(eles[i].id == id){
								ele = eles[i];
								break;
							}
						}
					// return 1 and only element
					}else{
						ele = eles;
					}
				}
			}
			return ele; // DomNode
		}
		return id; // DomNode
	}

	dojo.setContext = function(/*Object*/globalObject, /*DocumentElement*/globalDocument){
		// summary:
		//		changes the behavior of many core Dojo functions that deal with
		//		namespace and DOM lookup, changing them to work in a new global
		//		context. The varibles dj_currentContext and dj_currentDocument
		//		are modified as a result of calling this function.
		dj_currentContext = globalObject;
		dj_currentDocument = globalDocument;
	};

	dojo._fireCallback = function(callback, context, cbArguments){
		if((context)&&((typeof callback == "string")||(callback instanceof String))){
			callback=context[callback];
		}
		return (context ? callback.apply(context, cbArguments || [ ]) : callback());
	}

	dojo.withGlobal = function(/*Object*/globalObject, /*Function*/callback, /*Object?*/thisObject, /*Array?*/cbArguments){
		// summary:
		//		Call callback with globalObject as dojo.global() and globalObject.document
		//		as dojo.doc(). If provided, globalObject will be executed in the context of
		//		object thisObject
		// description:
		//		When callback() returns or throws an error, the dojo.global() and dojo.doc() will
		//		be restored to its previous state.
		var rval;
		var oldGlob = dj_currentContext;
		var oldDoc = dj_currentDocument;
		try{
			dojo.setContext(globalObject, globalObject.document);
			rval = dojo._fireCallback(callback, thisObject, cbArguments);
		}finally{
			dojo.setContext(oldGlob, oldDoc);
		}
		return rval;
	}

	dojo.withDoc = function (/*Object*/documentObject, /*Function*/callback, /*Object?*/thisObject, /*Array?*/cbArguments) {
		// summary:
		//		Call callback with documentObject as dojo.doc(). If provided, callback will be executed
		//		in the context of object thisObject
		// description:
		//		When callback() returns or throws an error, the dojo.doc() will
		//		be restored to its previous state.
		var rval;
		var oldDoc = dj_currentDocument;
		try{
			dj_currentDocument = documentObject;
			rval = dojo._fireCallback(callback, thisObject, cbArguments);
		}finally{
			dj_currentDocument = oldDoc;
		}
		return rval;
	}

} //if (typeof window != 'undefined')

//Semicolon is for when this file is integrated with a custom build on one line
//with some other file's contents. Sometimes that makes things not get defined
//properly, particularly with the using the closure below to do all the work.
;(function(){
	//Don't do this work if dojo.js has already done it.
	if(typeof dj_usingBootstrap != "undefined"){
		return;
	}

	var isRhino = false;
	var isSpidermonkey = false;
	var isDashboard = false;
	if((typeof this["load"] == "function")&&((typeof this["Packages"] == "function")||(typeof this["Packages"] == "object"))){
		isRhino = true;
	}else if(typeof this["load"] == "function"){
		isSpidermonkey  = true;
	}else if(window.widget){
		isDashboard = true;
	}

	var tmps = [];
	if((this["djConfig"])&&((djConfig["isDebug"])||(djConfig["debugAtAllCosts"]))){
		tmps.push("debug.js");
	}

	if((this["djConfig"])&&(djConfig["debugAtAllCosts"])&&(!isRhino)&&(!isDashboard)){
		tmps.push("browser_debug.js");
	}

	var loaderRoot = djConfig["baseScriptUri"];
	if((this["djConfig"])&&(djConfig["baseLoaderUri"])){
		loaderRoot = djConfig["baseLoaderUri"];
	}

	for(var x=0; x < tmps.length; x++){
		var spath = loaderRoot+"src/"+tmps[x];
		if(isRhino||isSpidermonkey){
			load(spath);
		} else {
			try {
				document.write("<scr"+"ipt type='text/javascript' src='"+spath+"'></scr"+"ipt>");
			} catch (e) {
				var script = document.createElement("script");
				script.src = spath;
				document.getElementsByTagName("head")[0].appendChild(script);
			}
		}
	}
})();

dojo.provide("dojo.lang.common");

dojo.lang.inherits = function(/*Function*/subclass, /*Function*/superclass){
	// summary: Set up inheritance between two classes.
	if(!dojo.lang.isFunction(superclass)){ 
		dojo.raise("dojo.inherits: superclass argument ["+superclass+"] must be a function (subclass: ["+subclass+"']");
	}
	subclass.prototype = new superclass();
	subclass.prototype.constructor = subclass;
	subclass.superclass = superclass.prototype;
	// DEPRECATED: super is a reserved word, use 'superclass'
	subclass['super'] = superclass.prototype;
}

dojo.lang._mixin = function(/*Object*/ obj, /*Object*/ props){
	// summary:
	//		Adds all properties and methods of props to obj. This addition is
	//		"prototype extension safe", so that instances of objects will not
	//		pass along prototype defaults.
	var tobj = {};
	for(var x in props){
		// the "tobj" condition avoid copying properties in "props"
		// inherited from Object.prototype.  For example, if obj has a custom
		// toString() method, don't overwrite it with the toString() method
		// that props inherited from Object.protoype
		if((typeof tobj[x] == "undefined") || (tobj[x] != props[x])){
			obj[x] = props[x];
		}
	}
	// IE doesn't recognize custom toStrings in for..in
	if(dojo.render.html.ie 
		&& (typeof(props["toString"]) == "function")
		&& (props["toString"] != obj["toString"])
		&& (props["toString"] != tobj["toString"]))
	{
		obj.toString = props.toString;
	}
	return obj; // Object
}

dojo.lang.mixin = function(/*Object*/obj, /*Object...*/props){
	// summary:	Adds all properties and methods of props to obj. 
	for(var i=1, l=arguments.length; i<l; i++){
		dojo.lang._mixin(obj, arguments[i]);
	}
	return obj; // Object
}

dojo.lang.extend = function(/*Object*/ constructor, /*Object...*/ props){
	// summary:
	//		Adds all properties and methods of props to constructor's
	//		prototype, making them available to all instances created with
	//		constructor.
	for(var i=1, l=arguments.length; i<l; i++){
		dojo.lang._mixin(constructor.prototype, arguments[i]);
	}
	return constructor; // Object
}

// Promote to dojo module
dojo.inherits = dojo.lang.inherits;
//dojo.lang._mixin = dojo.lang._mixin;
dojo.mixin = dojo.lang.mixin;
dojo.extend = dojo.lang.extend;

dojo.lang.find = function(	/*Array*/		array, 
							/*Object*/		value,
							/*Boolean?*/	identity,
							/*Boolean?*/	findLast){
	// summary:	
	//		Return the index of value in array, returning -1 if not found.
	// array: just what you think
	// value: the value to locate
	// identity: 
	//		If true, matches with identity comparison (===). If false, uses
	//		normal comparison (==).
	// findLast: 
	//		If true, returns index of last instance of value.
	// examples:
	//		find(array, value[, identity [findLast]]) // recommended
 	//		find(value, array[, identity [findLast]]) // deprecated
							
	// support both (array, value) and (value, array)
	if(!dojo.lang.isArrayLike(array) && dojo.lang.isArrayLike(value)) {
		dojo.deprecated('dojo.lang.find(value, array)', 'use dojo.lang.find(array, value) instead', "0.5");
		var temp = array;
		array = value;
		value = temp;
	}
	var isString = dojo.lang.isString(array);
	if(isString) { array = array.split(""); }

	if(findLast) {
		var step = -1;
		var i = array.length - 1;
		var end = -1;
	} else {
		var step = 1;
		var i = 0;
		var end = array.length;
	}
	if(identity){
		while(i != end) {
			if(array[i] === value){ return i; }
			i += step;
		}
	}else{
		while(i != end) {
			if(array[i] == value){ return i; }
			i += step;
		}
	}
	return -1;	// number
}

dojo.lang.indexOf = dojo.lang.find;

dojo.lang.findLast = function(/*Array*/array, /*Object*/value, /*boolean?*/identity){
	// summary:
	//		Return index of last occurance of value in array, returning -1 if
	//		not found. This is a shortcut for dojo.lang.find() with a true
	//		value for its "findLast" parameter.
	// identity:
	//		If true, matches with identity comparison (===). If false, uses
	//		normal comparison (==).
	return dojo.lang.find(array, value, identity, true); // number
}

dojo.lang.lastIndexOf = dojo.lang.findLast;

dojo.lang.inArray = function(array /*Array*/, value /*Object*/){
	// summary:	Return true if value is present in array.
	return dojo.lang.find(array, value) > -1; // boolean
}

/**
 * Partial implmentation of is* functions from
 * http://www.crockford.com/javascript/recommend.html
 * NOTE: some of these may not be the best thing to use in all situations
 * as they aren't part of core JS and therefore can't work in every case.
 * See WARNING messages inline for tips.
 *
 * The following is* functions are fairly "safe"
 */

dojo.lang.isObject = function(/*anything*/ it){
	// summary:	Return true if it is an Object, Array or Function.
	if(typeof it == "undefined"){ return false; }
	return (typeof it == "object" || it === null || dojo.lang.isArray(it) || dojo.lang.isFunction(it)); // Boolean
}

dojo.lang.isArray = function(/*anything*/ it){
	// summary:	Return true if it is an Array.
	return (it && it instanceof Array || typeof it == "array"); // Boolean
}

dojo.lang.isArrayLike = function(/*anything*/ it){
	// summary:	
	//		Return true if it can be used as an array (i.e. is an object with
	//		an integer length property).
	if((!it)||(dojo.lang.isUndefined(it))){ return false; }
	if(dojo.lang.isString(it)){ return false; }
	if(dojo.lang.isFunction(it)){ return false; } // keeps out built-in constructors (Number, String, ...) which have length properties
	if(dojo.lang.isArray(it)){ return true; }
	// form node itself is ArrayLike, but not always iterable. Use form.elements instead.
	if((it.tagName)&&(it.tagName.toLowerCase()=='form')){ return false; }
	if(dojo.lang.isNumber(it.length) && isFinite(it.length)){ return true; }
	return false; // Boolean
}

dojo.lang.isFunction = function(/*anything*/ it){
	// summary:	Return true if it is a Function.
	return (it instanceof Function || typeof it == "function"); // Boolean
};

(function(){
	// webkit treats NodeList as a function, which is bad
	if((dojo.render.html.capable)&&(dojo.render.html["safari"])){
		dojo.lang.isFunction = function(/*anything*/ it){
			if((typeof(it) == "function") && (it == "[object NodeList]")) { return false; }
			return (it instanceof Function || typeof it == "function"); // Boolean
		}
	}
})();

dojo.lang.isString = function(/*anything*/ it){
	// summary:	Return true if it is a String.
	return (typeof it == "string" || it instanceof String);
}

dojo.lang.isAlien = function(/*anything*/ it){
	// summary: Return true if it is not a built-in function. False if not.
	if(!it){ return false; }
	return !dojo.lang.isFunction(it) && /\{\s*\[native code\]\s*\}/.test(String(it)); // Boolean
}

dojo.lang.isBoolean = function(/*anything*/ it){
	// summary:	Return true if it is a Boolean.
	return (it instanceof Boolean || typeof it == "boolean"); // Boolean
}

/**
 * The following is***() functions are somewhat "unsafe". Fortunately,
 * there are workarounds the the language provides and are mentioned
 * in the WARNING messages.
 *
 */
dojo.lang.isNumber = function(/*anything*/ it){
	// summary:	Return true if it is a number.
	// description: 
	//		WARNING - In most cases, isNaN(it) is sufficient to determine whether or not
	// 		something is a number or can be used as such. For example, a number or string
	// 		can be used interchangably when accessing array items (array["1"] is the same as
	// 		array[1]) and isNaN will return false for both values ("1" and 1). However,
	// 		isNumber("1")  will return false, which is generally not too useful.
	// 		Also, isNumber(NaN) returns true, again, this isn't generally useful, but there
	// 		are corner cases (like when you want to make sure that two things are really
	// 		the same type of thing). That is really where isNumber "shines".
	//
	// Recommendation - Use isNaN(it) when possible
	
	return (it instanceof Number || typeof it == "number"); // Boolean
}

/*
 * FIXME: Should isUndefined go away since it is error prone?
 */
dojo.lang.isUndefined = function(/*anything*/ it){
	// summary: Return true if it is not defined.
	// description: 
	//		WARNING - In some cases, isUndefined will not behave as you
	// 		might expect. If you do isUndefined(foo) and there is no earlier
	// 		reference to foo, an error will be thrown before isUndefined is
	// 		called. It behaves correctly if you scope yor object first, i.e.
	// 		isUndefined(foo.bar) where foo is an object and bar isn't a
	// 		property of the object.
	//
	// Recommendation - Use typeof foo == "undefined" when possible

	return ((typeof(it) == "undefined")&&(it == undefined)); // Boolean
}

// end Crockford functions

dojo.provide("dojo.lang.array");


// FIXME: Is this worthless since you can do: if(name in obj)
// is this the right place for this?

dojo.lang.mixin(dojo.lang, {
	has: function(/*Object*/obj, /*String*/name){
		// summary: is there a property with the passed name in obj?
		try{
			return typeof obj[name] != "undefined"; // Boolean
		}catch(e){ return false; } // Boolean
	},

	isEmpty: function(/*Object*/obj){
		// summary:
		//		can be used to determine if the passed object is "empty". In
		//		the case of array-like objects, the length, property is
		//		examined, but for other types of objects iteration is used to
		//		examine the iterable "surface area" to determine if any
		//		non-prototypal properties have been assigned. This iteration is
		//		prototype-extension safe.
		if(dojo.lang.isObject(obj)){
			var tmp = {};
			var count = 0;
			for(var x in obj){
				if(obj[x] && (!tmp[x])){
					count++;
					break;
				} 
			}
			return count == 0; // boolean
		}else if(dojo.lang.isArrayLike(obj) || dojo.lang.isString(obj)){
			return obj.length == 0; // boolean
		}
	},

	map: function(/*Array*/arr, /*Object|Function*/obj, /*Function?*/unary_func){
		// summary:
		//		returns a new array constituded from the return values of
		//		passing each element of arr into unary_func. The obj parameter
		//		may be passed to enable the passed function to be called in
		//		that scope. In environments that support JavaScript 1.6, this
		//		function is a passthrough to the built-in map() function
		//		provided by Array instances. For details on this, see:
		// 			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map
		// examples:
		//		dojo.lang.map([1, 2, 3, 4], function(item){ return item+1 });
		//		// returns [2, 3, 4, 5]
		var isString = dojo.lang.isString(arr);
		if(isString){
			// arr: String
			arr = arr.split("");
		}
		if(dojo.lang.isFunction(obj)&&(!unary_func)){
			unary_func = obj;
			obj = dj_global;
		}else if(dojo.lang.isFunction(obj) && unary_func){
			// ff 1.5 compat
			var tmpObj = obj;
			obj = unary_func;
			unary_func = tmpObj;
		}
		if(Array.map){
			var outArr = Array.map(arr, unary_func, obj);
		}else{
			var outArr = [];
			for(var i=0;i<arr.length;++i){
				outArr.push(unary_func.call(obj, arr[i]));
			}
		}
		if(isString) {
			return outArr.join(""); // String
		} else {
			return outArr; // Array
		}
	},

	reduce: function(/*Array*/arr, initialValue, /*Object|Function*/obj, /*Function*/binary_func){
		// summary:
		// 		similar to Python's builtin reduce() function. The result of
		// 		the previous computation is passed as the first argument to
		// 		binary_func along with the next value from arr. The result of
		// 		this call is used along with the subsequent value from arr, and
		// 		this continues until arr is exhausted. The return value is the
		// 		last result. The "obj" and "initialValue" parameters may be
		// 		safely omitted and the order of obj and binary_func may be
		// 		reversed. The default order of the obj and binary_func argument
		// 		will probably be reversed in a future release, and this call
		// 		order is supported today.
		// examples:
		//		dojo.lang.reduce([1, 2, 3, 4], function(last, next){ return last+next});
		//		returns 10
		var reducedValue = initialValue;
		if(arguments.length == 1){
			dojo.debug("dojo.lang.reduce called with too few arguments!");
			return false;
		}else if(arguments.length == 2){
			binary_func = initialValue;
			reducedValue = arr.shift();
		}else if(arguments.lenght == 3){
			if(dojo.lang.isFunction(obj)){
				binary_func = obj;
				obj = null;
			}
		}else{
			// un-fsck the default order
			// FIXME:
			//		could be wrong for some strange function object cases. Not
			//		sure how to test for them.
			if(dojo.lang.isFunction(obj)){
				var tmp = binary_func;
				binary_func = obj;
				obj = tmp;
			}
		}

		var ob = obj ? obj : dj_global;
		dojo.lang.map(arr, 
			function(val){
				reducedValue = binary_func.call(ob, reducedValue, val);
			}
		);
		return reducedValue;
	},

	forEach: function(/*Array*/anArray, /*Function*/callback, /*Object?*/thisObject){
		// summary:
		//		for every item in anArray, call callback with that item as its
		//		only parameter. Return values are ignored. This funciton
		//		corresponds (and wraps) the JavaScript 1.6 forEach method. For
		//		more details, see:
		//			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach
		if(dojo.lang.isString(anArray)){
			// anArray: String
			anArray = anArray.split(""); 
		}
		if(Array.forEach){
			Array.forEach(anArray, callback, thisObject);
		}else{
			// FIXME: there are several ways of handilng thisObject. Is dj_global always the default context?
			if(!thisObject){
				thisObject=dj_global;
			}
			for(var i=0,l=anArray.length; i<l; i++){ 
				callback.call(thisObject, anArray[i], i, anArray);
			}
		}
	},

	_everyOrSome: function(/*Boolean*/every, /*Array*/arr, /*Function*/callback, /*Object?*/thisObject){
		if(dojo.lang.isString(arr)){ 
			//arr: String
			arr = arr.split(""); 
		}
		if(Array.every){
			return Array[ every ? "every" : "some" ](arr, callback, thisObject);
		}else{
			if(!thisObject){
				thisObject = dj_global;
			}
			for(var i=0,l=arr.length; i<l; i++){
				var result = callback.call(thisObject, arr[i], i, arr);
				if(every && !result){
					return false; // Boolean
				}else if((!every)&&(result)){
					return true; // Boolean
				}
			}
			return Boolean(every); // Boolean
		}
	},

	every: function(/*Array*/arr, /*Function*/callback, /*Object?*/thisObject){
		// summary:
		//		determines whether or not every item in the array satisfies the
		//		condition implemented by callback. thisObject may be used to
		//		scope the call to callback. The function signature is derived
		//		from the JavaScript 1.6 Array.every() function. More
		//		information on this can be found here:
		//			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every
		// examples:
		//		dojo.lang.every([1, 2, 3, 4], function(item){ return item>1; });
		//		// returns false
		//		dojo.lang.every([1, 2, 3, 4], function(item){ return item>0; });
		//		// returns true 
		return this._everyOrSome(true, arr, callback, thisObject); // Boolean
	},

	some: function(/*Array*/arr, /*Function*/callback, /*Object?*/thisObject){
		// summary:
		//		determines whether or not any item in the array satisfies the
		//		condition implemented by callback. thisObject may be used to
		//		scope the call to callback. The function signature is derived
		//		from the JavaScript 1.6 Array.some() function. More
		//		information on this can be found here:
		//			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some
		// examples:
		//		dojo.lang.some([1, 2, 3, 4], function(item){ return item>1; });
		//		// returns true
		//		dojo.lang.some([1, 2, 3, 4], function(item){ return item<1; });
		//		// returns false
		return this._everyOrSome(false, arr, callback, thisObject); // Boolean
	},

	filter: function(/*Array*/arr, /*Function*/callback, /*Object?*/thisObject){
		// summary:
		//		returns a new Array with those items from arr that match the
		//		condition implemented by callback.thisObject may be used to
		//		scope the call to callback. The function signature is derived
		//		from the JavaScript 1.6 Array.filter() function, although
		//		special accomidation is made in our implementation for strings.
		//		More information on the JS 1.6 API can be found here:
		//			http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter
		// examples:
		//		dojo.lang.some([1, 2, 3, 4], function(item){ return item>1; });
		//		// returns [2, 3, 4]
		var isString = dojo.lang.isString(arr);
		if(isString){ /*arr: String*/arr = arr.split(""); }
		var outArr;
		if(Array.filter){
			outArr = Array.filter(arr, callback, thisObject);
		}else{
			if(!thisObject){
				if(arguments.length >= 3){ dojo.raise("thisObject doesn't exist!"); }
				thisObject = dj_global;
			}

			outArr = [];
			for(var i = 0; i < arr.length; i++){
				if(callback.call(thisObject, arr[i], i, arr)){
					outArr.push(arr[i]);
				}
			}
		}
		if(isString){
			return outArr.join(""); // String
		} else {
			return outArr; // Array
		}
	},

	unnest: function(/* ... */){
		// summary:
		//		Creates a 1-D array out of all the arguments passed,
		//		unravelling any array-like objects in the process
		// usage:
		//		unnest(1, 2, 3) ==> [1, 2, 3]
		//		unnest(1, [2, [3], [[[4]]]]) ==> [1, 2, 3, 4]

		var out = [];
		for(var i = 0; i < arguments.length; i++){
			if(dojo.lang.isArrayLike(arguments[i])){
				var add = dojo.lang.unnest.apply(this, arguments[i]);
				out = out.concat(add);
			}else{
				out.push(arguments[i]);
			}
		}
		return out; // Array
	},

	toArray: function(/*Object*/arrayLike, /*Number*/startOffset){
		// summary:
		//		Converts an array-like object (i.e. arguments, DOMCollection)
		//		to an array. Returns a new Array object.
		var array = [];
		for(var i = startOffset||0; i < arrayLike.length; i++){
			array.push(arrayLike[i]);
		}
		return array; // Array
	}
});

dojo.provide("dojo.lang.extras");


dojo.lang.setTimeout = function(/*Function*/func, /*int*/delay /*, ...*/){
	// summary:
	//		Sets a timeout in milliseconds to execute a function in a given
	//		context with optional arguments.
	// usage:
	//		dojo.lang.setTimeout(Object context, function func, number delay[, arg1[, ...]]);
	//		dojo.lang.setTimeout(function func, number delay[, arg1[, ...]]);

	var context = window, argsStart = 2;
	if(!dojo.lang.isFunction(func)){
		context = func;
		func = delay;
		delay = arguments[2];
		argsStart++;
	}

	if(dojo.lang.isString(func)){
		func = context[func];
	}
	
	var args = [];
	for (var i = argsStart; i < arguments.length; i++){
		args.push(arguments[i]);
	}
	return dojo.global().setTimeout(function(){ func.apply(context, args); }, delay); // int
}

dojo.lang.clearTimeout = function(/*int*/timer){
	// summary: clears timer by number from the execution queue

	// FIXME:
	//		why do we have this function? It's not portable outside of browser
	//		environments and it's a stupid wrapper on something that browsers
	//		provide anyway.
	dojo.global().clearTimeout(timer);
}

dojo.lang.getNameInObj = function(/*Object*/ns, /*unknown*/item){
	// summary: 
	//		looks for a value in the object ns with a value matching item and
	//		returns the property name
	// ns: if null, dj_global is used
	// item: value to return a name for
	if(!ns){ ns = dj_global; }

	for(var x in ns){
		if(ns[x] === item){
			return new String(x); // String
		}
	}
	return null; // null
}

dojo.lang.shallowCopy = function(/*Object*/obj, /*Boolean?*/deep){
	// summary:
	//		copies object obj one level deep, or full depth if deep is true
	var i, ret;	

	if(obj === null){ /*obj: null*/ return null; } // null
	
	if(dojo.lang.isObject(obj)){
		// obj: Object	
		ret = new obj.constructor();
		for(i in obj){
			if(dojo.lang.isUndefined(ret[i])){
				ret[i] = deep ? dojo.lang.shallowCopy(obj[i], deep) : obj[i];
			}
		}
	}else if(dojo.lang.isArray(obj)){
		// obj: Array
		ret = [];
		for(i=0; i<obj.length; i++){
			ret[i] = deep ? dojo.lang.shallowCopy(obj[i], deep) : obj[i];
		}
	}else{
		// obj: Object
		ret = obj;
	}

	return ret; // Object
}

dojo.lang.firstValued = function(/* ... */){
	// summary: Return the first argument that isn't undefined

	for(var i = 0; i < arguments.length; i++){
		if(typeof arguments[i] != "undefined"){
			return arguments[i]; // Object
		}
	}
	return undefined; // undefined
}

dojo.lang.getObjPathValue = function(/*String*/objpath, /*Object?*/context, /*Boolean?*/create){
	// summary:
	//		Gets a value from a reference specified as a string descriptor,
	//		(e.g. "A.B") in the given context.
	// context: if not specified, dj_global is used
	// create: if true, undefined objects in the path are created.
	with(dojo.parseObjPath(objpath, context, create)){
		return dojo.evalProp(prop, obj, create); // Object
	}
}

dojo.lang.setObjPathValue = function(/*String*/objpath, /*anything*/value, /*Object?*/context, /*Boolean?*/create){
	// summary:
	//		Sets a value on a reference specified as a string descriptor.
	//		(e.g. "A.B") in the given context. This is similar to straight
	//		assignment, except that the object structure in question can
	//		optionally be created if it does not exist.
	//	context: if not specified, dj_global is used
	//	create: if true, undefined objects in the path are created.

	// FIXME: why is this function valuable? It should be scheduled for
	// removal on the grounds that dojo.parseObjPath does most of it's work and
	// is more straightforward and has fewer dependencies. Also, the order of
	// arguments is bone-headed. "context" should clearly come after "create".
	// *sigh*
	dojo.deprecated("dojo.lang.setObjPathValue", "use dojo.parseObjPath and the '=' operator", "0.6");

	if(arguments.length < 4){
		create = true;
	}
	with(dojo.parseObjPath(objpath, context, create)){
		if(obj && (create || (prop in obj))){
			obj[prop] = value;
		}
	}
}

dojo.provide("dojo.lang.func");

dojo.lang.hitch = function(/*Object*/thisObject, /*Function|String*/method){
	// summary: 
	//		Returns a function that will only ever execute in the a given scope
	//		(thisObject). This allows for easy use of object member functions
	//		in callbacks and other places in which the "this" keyword may
	//		otherwise not reference the expected scope. Note that the order of
	//		arguments may be reversed in a future version.
	// thisObject: the scope to run the method in
	// method:
	//		a function to be "bound" to thisObject or the name of the method in
	//		thisObject to be used as the basis for the binding
	// usage:
	//		dojo.lang.hitch(foo, "bar")(); // runs foo.bar() in the scope of foo
	//		dojo.lang.hitch(foo, myFunction); // returns a function that runs myFunction in the scope of foo

	// FIXME:
	//		should this be extended to "fixate" arguments in a manner similar
	//		to dojo.lang.curry, but without the default execution of curry()?
	var fcn = (dojo.lang.isString(method) ? thisObject[method] : method) || function(){};
	return function(){
		return fcn.apply(thisObject, arguments); // Function
	};
}

dojo.lang.anonCtr = 0;
dojo.lang.anon = {};

dojo.lang.nameAnonFunc = function(/*Function*/anonFuncPtr, /*Object*/thisObj, /*Boolean*/searchForNames){
	// summary:
	//		Creates a reference to anonFuncPtr in thisObj with a completely
	//		unique name. The new name is returned as a String.  If
	//		searchForNames is true, an effort will be made to locate an
	//		existing reference to anonFuncPtr in thisObj, and if one is found,
	//		the existing name will be returned instead. The default is for
	//		searchForNames to be false.
	var nso = (thisObj|| dojo.lang.anon);
	if( (searchForNames) ||
		((dj_global["djConfig"])&&(djConfig["slowAnonFuncLookups"] == true)) ){
		for(var x in nso){
			try{
				if(nso[x] === anonFuncPtr){
					return x;
				}
			}catch(e){} // window.external fails in IE embedded in Eclipse (Eclipse bug #151165)
		}
	}
	var ret = "__"+dojo.lang.anonCtr++;
	while(typeof nso[ret] != "undefined"){
		ret = "__"+dojo.lang.anonCtr++;
	}
	nso[ret] = anonFuncPtr;
	return ret; // String
}

dojo.lang.forward = function(funcName){
	// summary:
	// 		Returns a function that forwards a method call to
	// 		this.funcName(...).  Unlike dojo.lang.hitch(), the "this" scope is
	// 		not fixed on a single object. Ported from MochiKit.
	return function(){
		return this[funcName].apply(this, arguments);
	}; // Function
}

dojo.lang.curry = function(thisObj, func /* args ... */){
	// summary:
	//		similar to the curry() method found in many functional programming
	//		environments, this function returns an "argument accumulator"
	//		function, bound to a particular scope, and "primed" with a variable
	//		number of arguments. The curry method is unique in that it returns
	//		a function that may return other "partial" function which can be
	//		called repeatedly. New functions are returned until the arity of
	//		the original function is reached, at which point the underlying
	//		function (func) is called in the scope thisObj with all of the
	//		accumulated arguments (plus any extras) in positional order.
	// examples:
	//		assuming a function defined like this:
	//			var foo = {
	//				bar: function(arg1, arg2, arg3){
	//					dojo.debug.apply(dojo, arguments);
	//				}
	//			};
	//		
	//		dojo.lang.curry() can be used most simply in this way:
	//		
	//			tmp = dojo.lang.curry(foo, foo.bar, "arg one", "thinger");
	//			tmp("blah", "this is superfluous");
	//			// debugs: "arg one thinger blah this is superfluous"
	//			tmp("blah");
	//			// debugs: "arg one thinger blah"
	//			tmp();
	//			// returns a function exactly like tmp that expects one argument
	//
	//		other intermittent functions could be created until the 3
	//		positional arguments are filled:
	//
	//			tmp = dojo.lang.curry(foo, foo.bar, "arg one");
	//			tmp2 = tmp("arg two");
	//			tmp2("blah blah");
	//			// debugs: "arg one arg two blah blah"
	//			tmp2("oy");
	//			// debugs: "arg one arg two oy"
	//
	//		curry() can also be used to call the function if enough arguments
	//		are passed in the initial invocation:
	//
	//			dojo.lang.curry(foo, foo.bar, "one", "two", "three", "four");
	//			// debugs: "one two three four"
	//			dojo.lang.curry(foo, foo.bar, "one", "two", "three");
	//			// debugs: "one two three"


	// FIXME: the order of func and thisObj should be changed!!!
	var outerArgs = [];
	thisObj = thisObj||dj_global;
	if(dojo.lang.isString(func)){
		func = thisObj[func];
	}
	for(var x=2; x<arguments.length; x++){
		outerArgs.push(arguments[x]);
	}
	// since the event system replaces the original function with a new
	// join-point runner with an arity of 0, we check to see if it's left us
	// any clues about the original arity in lieu of the function's actual
	// length property
	var ecount = (func["__preJoinArity"]||func.length) - outerArgs.length;
	// borrowed from svend tofte
	function gather(nextArgs, innerArgs, expected){
		var texpected = expected;
		var totalArgs = innerArgs.slice(0); // copy
		for(var x=0; x<nextArgs.length; x++){
			totalArgs.push(nextArgs[x]);
		}
		// check the list of provided nextArgs to see if it, plus the
		// number of innerArgs already supplied, meets the total
		// expected.
		expected = expected-nextArgs.length;
		if(expected<=0){
			var res = func.apply(thisObj, totalArgs);
			expected = texpected;
			return res;
		}else{
			return function(){
				return gather(arguments,// check to see if we've been run
										// with enough args
							totalArgs,	// a copy
							expected);	// how many more do we need to run?;
			};
		}
	}
	return gather([], outerArgs, ecount);
}

dojo.lang.curryArguments = function(/*Object*/thisObj, /*Function*/func, /*Array*/args, /*Integer, optional*/offset){
	// summary:
	//		similar to dojo.lang.curry(), except that a list of arguments to
	//		start the curry with may be provided as an array instead of as
	//		positional arguments. An offset may be specified from the 0 index
	//		to skip some elements in args.
	var targs = [];
	var x = offset||0;
	for(x=offset; x<args.length; x++){
		targs.push(args[x]); // ensure that it's an arr
	}
	return dojo.lang.curry.apply(dojo.lang, [thisObj, func].concat(targs));
}

dojo.lang.tryThese = function(/*...*/){
	// summary:
	//		executes each function argument in turn, returning the return value
	//		from the first one which does not throw an exception in execution.
	//		Any number of functions may be passed.
	for(var x=0; x<arguments.length; x++){
		try{
			if(typeof arguments[x] == "function"){
				var ret = (arguments[x]());
				if(ret){
					return ret;
				}
			}
		}catch(e){
			dojo.debug(e);
		}
	}
}

dojo.lang.delayThese = function(/*Array*/farr, /*Function, optional*/cb, /*Integer*/delay, /*Function, optional*/onend){
	// summary:
	//		executes a series of functions contained in farr, but spaces out
	//		calls to each function by the millisecond delay provided. If cb is
	//		provided, it will be called directly after each item in farr is
	//		called and if onend is passed, it will be called when all items
	//		have completed executing.

	/**
	 * alternate: (array funcArray, function callback, function onend)
	 * alternate: (array funcArray, function callback)
	 * alternate: (array funcArray)
	 */
	if(!farr.length){ 
		if(typeof onend == "function"){
			onend();
		}
		return;
	}
	if((typeof delay == "undefined")&&(typeof cb == "number")){
		delay = cb;
		cb = function(){};
	}else if(!cb){
		cb = function(){};
		if(!delay){ delay = 0; }
	}
	setTimeout(function(){
		(farr.shift())();
		cb();
		dojo.lang.delayThese(farr, cb, delay, onend);
	}, delay);
}

dojo.provide("dojo.event.common");


// TODO: connection filter functions
//			these are functions that accept a method invocation (like around
//			advice) and return a boolean based on it. That value determines
//			whether or not the connection proceeds. It could "feel" like around
//			advice for those who know what it is (calling proceed() or not),
//			but I think presenting it as a "filter" and/or calling it with the
//			function args and not the MethodInvocation might make it more
//			palletable to "normal" users than around-advice currently is
// TODO: execution scope mangling
//			YUI's event facility by default executes listeners in the context
//			of the source object. This is very odd, but should probably be
//			supported as an option (both for the source and for the dest). It
//			can be thought of as a connection-specific hitch().
// TODO: more resiliency for 4+ arguments to connect()

dojo.event = new function(){
	this._canTimeout = dojo.lang.isFunction(dj_global["setTimeout"])||dojo.lang.isAlien(dj_global["setTimeout"]);

	// FIXME: where should we put this method (not here!)?
	function interpolateArgs(args, searchForNames){
		var dl = dojo.lang;
		var ao = {
			srcObj: dj_global,
			srcFunc: null,
			adviceObj: dj_global,
			adviceFunc: null,
			aroundObj: null,
			aroundFunc: null,
			adviceType: (args.length>2) ? args[0] : "after",
			precedence: "last",
			once: false,
			delay: null,
			rate: 0,
			adviceMsg: false
		};

		switch(args.length){
			case 0: return;
			case 1: return;
			case 2:
				ao.srcFunc = args[0];
				ao.adviceFunc = args[1];
				break;
			case 3:
				if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isString(args[2]))){
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
				}else if((dl.isString(args[1]))&&(dl.isString(args[2]))){
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
				}else if((dl.isObject(args[0]))&&(dl.isString(args[1]))&&(dl.isFunction(args[2]))){
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					var tmpName  = dl.nameAnonFunc(args[2], ao.adviceObj, searchForNames);
					ao.adviceFunc = tmpName;
				}else if((dl.isFunction(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))){
					ao.adviceType = "after";
					ao.srcObj = dj_global;
					var tmpName  = dl.nameAnonFunc(args[0], ao.srcObj, searchForNames);
					ao.srcFunc = tmpName;
					ao.adviceObj = args[1];
					ao.adviceFunc = args[2];
				}
				break;
			case 4:
				if((dl.isObject(args[0]))&&(dl.isObject(args[2]))){
					// we can assume that we've got an old-style "connect" from
					// the sigslot school of event attachment. We therefore
					// assume after-advice.
					ao.adviceType = "after";
					ao.srcObj = args[0];
					ao.srcFunc = args[1];
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else if((dl.isString(args[0]))&&(dl.isString(args[1]))&&(dl.isObject(args[2]))){
					ao.adviceType = args[0];
					ao.srcObj = dj_global;
					ao.srcFunc = args[1];
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else if((dl.isString(args[0]))&&(dl.isFunction(args[1]))&&(dl.isObject(args[2]))){
					ao.adviceType = args[0];
					ao.srcObj = dj_global;
					var tmpName  = dl.nameAnonFunc(args[1], dj_global, searchForNames);
					ao.srcFunc = tmpName;
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else if((dl.isString(args[0]))&&(dl.isObject(args[1]))&&(dl.isString(args[2]))&&(dl.isFunction(args[3]))){
					ao.srcObj = args[1];
					ao.srcFunc = args[2];
					var tmpName  = dl.nameAnonFunc(args[3], dj_global, searchForNames);
					ao.adviceObj = dj_global;
					ao.adviceFunc = tmpName;
				}else if(dl.isObject(args[1])){
					ao.srcObj = args[1];
					ao.srcFunc = args[2];
					ao.adviceObj = dj_global;
					ao.adviceFunc = args[3];
				}else if(dl.isObject(args[2])){
					ao.srcObj = dj_global;
					ao.srcFunc = args[1];
					ao.adviceObj = args[2];
					ao.adviceFunc = args[3];
				}else{
					ao.srcObj = ao.adviceObj = ao.aroundObj = dj_global;
					ao.srcFunc = args[1];
					ao.adviceFunc = args[2];
					ao.aroundFunc = args[3];
				}
				break;
			case 6:
				ao.srcObj = args[1];
				ao.srcFunc = args[2];
				ao.adviceObj = args[3]
				ao.adviceFunc = args[4];
				ao.aroundFunc = args[5];
				ao.aroundObj = dj_global;
				break;
			default:
				ao.srcObj = args[1];
				ao.srcFunc = args[2];
				ao.adviceObj = args[3]
				ao.adviceFunc = args[4];
				ao.aroundObj = args[5];
				ao.aroundFunc = args[6];
				ao.once = args[7];
				ao.delay = args[8];
				ao.rate = args[9];
				ao.adviceMsg = args[10];
				break;
		}

		if(dl.isFunction(ao.aroundFunc)){
			var tmpName  = dl.nameAnonFunc(ao.aroundFunc, ao.aroundObj, searchForNames);
			ao.aroundFunc = tmpName;
		}

		if(dl.isFunction(ao.srcFunc)){
			ao.srcFunc = dl.getNameInObj(ao.srcObj, ao.srcFunc);
		}

		if(dl.isFunction(ao.adviceFunc)){
			ao.adviceFunc = dl.getNameInObj(ao.adviceObj, ao.adviceFunc);
		}

		if((ao.aroundObj)&&(dl.isFunction(ao.aroundFunc))){
			ao.aroundFunc = dl.getNameInObj(ao.aroundObj, ao.aroundFunc);
		}

		if(!ao.srcObj){
			dojo.raise("bad srcObj for srcFunc: "+ao.srcFunc);
		}
		if(!ao.adviceObj){
			dojo.raise("bad adviceObj for adviceFunc: "+ao.adviceFunc);
		}
		
		if(!ao.adviceFunc){
			dojo.debug("bad adviceFunc for srcFunc: "+ao.srcFunc);
			dojo.debugShallow(ao);
		} 
		
		return ao;
	}

	this.connect = function(/*...*/){
		// summary:
		//		dojo.event.connect is the glue that holds most Dojo-based
		//		applications together. Most combinations of arguments are
		//		supported, with the connect() method attempting to disambiguate
		//		the implied types of positional parameters. The following will
		//		all work:
		//			dojo.event.connect("globalFunctionName1", "globalFunctionName2");
		//			dojo.event.connect(functionReference1, functionReference2);
		//			dojo.event.connect("globalFunctionName1", functionReference2);
		//			dojo.event.connect(functionReference1, "globalFunctionName2");
		//			dojo.event.connect(scope1, "functionName1", "globalFunctionName2");
		//			dojo.event.connect("globalFunctionName1", scope2, "functionName2");
		//			dojo.event.connect(scope1, "functionName1", scope2, "functionName2");
		//			dojo.event.connect("after", scope1, "functionName1", scope2, "functionName2");
		//			dojo.event.connect("before", scope1, "functionName1", scope2, "functionName2");
		//			dojo.event.connect("around", 	scope1, "functionName1", 
		//											scope2, "functionName2",
		//											aroundFunctionReference);
		//			dojo.event.connect("around", 	scope1, "functionName1", 
		//											scope2, "functionName2",
		//											scope3, "aroundFunctionName");
		//			dojo.event.connect("before-around", 	scope1, "functionName1", 
		//													scope2, "functionName2",
		//													aroundFunctionReference);
		//			dojo.event.connect("after-around", 		scope1, "functionName1", 
		//													scope2, "functionName2",
		//													aroundFunctionReference);
		//			dojo.event.connect("after-around", 		scope1, "functionName1", 
		//													scope2, "functionName2",
		//													scope3, "aroundFunctionName");
		//			dojo.event.connect("around", 	scope1, "functionName1", 
		//											scope2, "functionName2",
		//											scope3, "aroundFunctionName", true, 30);
		//			dojo.event.connect("around", 	scope1, "functionName1", 
		//											scope2, "functionName2",
		//											scope3, "aroundFunctionName", null, null, 10);
		// adviceType: 
		//		Optional. String. One of "before", "after", "around",
		//		"before-around", or "after-around". FIXME
		// srcObj:
		//		the scope in which to locate/execute the named srcFunc. Along
		//		with srcFunc, this creates a way to dereference the function to
		//		call. So if the function in question is "foo.bar", the
		//		srcObj/srcFunc pair would be foo and "bar", where "bar" is a
		//		string and foo is an object reference.
		// srcFunc:
		//		the name of the function to connect to. When it is executed,
		//		the listener being registered with this call will be called.
		//		The adviceType defines the call order between the source and
		//		the target functions.
		// adviceObj:
		//		the scope in which to locate/execute the named adviceFunc.
		// adviceFunc:
		//		the name of the function being conected to srcObj.srcFunc
		// aroundObj:
		//		the scope in which to locate/execute the named aroundFunc.
		// aroundFunc:
		//		the name of, or a reference to, the function that will be used
		//		to mediate the advice call. Around advice requires a special
		//		unary function that will be passed a "MethodInvocation" object.
		//		These objects have several important properties, namely:
		//			- args
		//				a mutable array of arguments to be passed into the
		//				wrapped function
		//			- proceed
		//				a function that "continues" the invocation. The result
		//				of this function is the return of the wrapped function.
		//				You can then manipulate this return before passing it
		//				back out (or take further action based on it).
		// once:
		//		boolean that determines whether or not this connect() will
		//		create a new connection if an identical connect() has already
		//		been made. Defaults to "false".
		// delay:
		//		an optional delay (in ms), as an integer, for dispatch of a
		//		listener after the source has been fired.
		// rate:
		//		an optional rate throttling parameter (integer, in ms). When
		//		specified, this particular connection will not fire more than
		//		once in the interval specified by the rate
		// adviceMsg:
		//		boolean. Should the listener have all the parameters passed in
		//		as a single argument?

		/*
				ao.adviceType = args[0];
				ao.srcObj = args[1];
				ao.srcFunc = args[2];
				ao.adviceObj = args[3]
				ao.adviceFunc = args[4];
				ao.aroundObj = args[5];
				ao.aroundFunc = args[6];
				ao.once = args[7];
				ao.delay = args[8];
				ao.rate = args[9];
				ao.adviceMsg = args[10];
		*/
		if(arguments.length == 1){
			var ao = arguments[0];
		}else{
			var ao = interpolateArgs(arguments, true);
		}
		if(dojo.lang.isString(ao.srcFunc) && (ao.srcFunc.toLowerCase() == "onkey") ){
			if(dojo.render.html.ie){
				ao.srcFunc = "onkeydown";
				this.connect(ao);
			}
			ao.srcFunc = "onkeypress";
		}


		if(dojo.lang.isArray(ao.srcObj) && ao.srcObj!=""){
			var tmpAO = {};
			for(var x in ao){
				tmpAO[x] = ao[x];
			}
			var mjps = [];
			dojo.lang.forEach(ao.srcObj, function(src){
				if((dojo.render.html.capable)&&(dojo.lang.isString(src))){
					src = dojo.byId(src);
					// dojo.debug(src);
				}
				tmpAO.srcObj = src;
				// dojo.debug(tmpAO.srcObj, tmpAO.srcFunc);
				// dojo.debug(tmpAO.adviceObj, tmpAO.adviceFunc);
				mjps.push(dojo.event.connect.call(dojo.event, tmpAO));
			});
			return mjps;
		}

		// FIXME: just doing a "getForMethod()" seems to be enough to put this into infinite recursion!!
		var mjp = dojo.event.MethodJoinPoint.getForMethod(ao.srcObj, ao.srcFunc);
		if(ao.adviceFunc){
			var mjp2 = dojo.event.MethodJoinPoint.getForMethod(ao.adviceObj, ao.adviceFunc);
		}

		mjp.kwAddAdvice(ao);

		// advanced users might want to fsck w/ the join point manually
		return mjp; // a MethodJoinPoint object
	}

	this.log = function(/*object or funcName*/ a1, /*funcName*/ a2){
		// summary:
		//		a function that will wrap and log all calls to the specified
		//		a1.a2() function. If only a1 is passed, it'll be used as a
		//		function or function name on the global context. Logging will
		//		be sent to dojo.debug
		// a1:
		//		if a2 is passed, this should be an object. If not, it can be a
		//		function or function name.
		// a2:
		//		a function name
		var kwArgs;
		if((arguments.length == 1)&&(typeof a1 == "object")){
			kwArgs = a1;
		}else{
			kwArgs = {
				srcObj: a1,
				srcFunc: a2
			};
		}
		kwArgs.adviceFunc = function(){
			var argsStr = [];
			for(var x=0; x<arguments.length; x++){
				argsStr.push(arguments[x]);
			}
			dojo.debug("("+kwArgs.srcObj+")."+kwArgs.srcFunc, ":", argsStr.join(", "));
		}
		this.kwConnect(kwArgs);
	}

	this.connectBefore = function(){
		// summary:
		//	 	takes the same parameters as dojo.event.connect(), except that
		//	 	the advice type will always be "before"
		var args = ["before"];
		for(var i = 0; i < arguments.length; i++){ args.push(arguments[i]); }
		return this.connect.apply(this, args); // a MethodJoinPoint object
	}

	this.connectAround = function(){
		// summary:
		//	 	takes the same parameters as dojo.event.connect(), except that
		//	 	the advice type will always be "around"
		var args = ["around"];
		for(var i = 0; i < arguments.length; i++){ args.push(arguments[i]); }
		return this.connect.apply(this, args); // a MethodJoinPoint object
	}

	this.connectOnce = function(){
		// summary:
		//	 	takes the same parameters as dojo.event.connect(), except that
		//	 	the "once" flag will always be set to "true"
		var ao = interpolateArgs(arguments, true);
		ao.once = true;
		return this.connect(ao); // a MethodJoinPoint object
	}

	this._kwConnectImpl = function(kwArgs, disconnect){
		var fn = (disconnect) ? "disconnect" : "connect";
		if(typeof kwArgs["srcFunc"] == "function"){
			kwArgs.srcObj = kwArgs["srcObj"]||dj_global;
			var tmpName  = dojo.lang.nameAnonFunc(kwArgs.srcFunc, kwArgs.srcObj, true);
			kwArgs.srcFunc = tmpName;
		}
		if(typeof kwArgs["adviceFunc"] == "function"){
			kwArgs.adviceObj = kwArgs["adviceObj"]||dj_global;
			var tmpName  = dojo.lang.nameAnonFunc(kwArgs.adviceFunc, kwArgs.adviceObj, true);
			kwArgs.adviceFunc = tmpName;
		}
		kwArgs.srcObj = kwArgs["srcObj"]||dj_global;
		kwArgs.adviceObj = kwArgs["adviceObj"]||kwArgs["targetObj"]||dj_global;
		kwArgs.adviceFunc = kwArgs["adviceFunc"]||kwArgs["targetFunc"];
		// pass kwargs to avoid unrolling/repacking
		return dojo.event[fn](kwArgs);
	}

	this.kwConnect = function(/*Object*/ kwArgs){
		// summary:
		//		A version of dojo.event.connect() that takes a map of named
		//		parameters instead of the positional parameters that
		//		dojo.event.connect() uses. For many advanced connection types,
		//		this can be a much more readable (and potentially faster)
		//		alternative.
		// kwArgs:
		// 		An object that can have the following properties:
		//			- adviceType
		//			- srcObj
		//			- srcFunc
		//			- adviceObj
		//			- adviceFunc 
		//			- aroundObj
		//			- aroundFunc
		//			- once
		//			- delay
		//			- rate
		//			- adviceMsg
		//		As with connect, only srcFunc and adviceFunc are generally
		//		required

		return this._kwConnectImpl(kwArgs, false); // a MethodJoinPoint object

	}

	this.disconnect = function(){
		// summary:
		//		Takes the same parameters as dojo.event.connect() but destroys
		//		an existing connection instead of building a new one. For
		//		multiple identical connections, multiple disconnect() calls
		//		will unroll one each time it's called.
		if(arguments.length == 1){
			var ao = arguments[0];
		}else{
			var ao = interpolateArgs(arguments, true);
		}
		if(!ao.adviceFunc){ return; } // nothing to disconnect
		if(dojo.lang.isString(ao.srcFunc) && (ao.srcFunc.toLowerCase() == "onkey") ){
			if(dojo.render.html.ie){
				ao.srcFunc = "onkeydown";
				this.disconnect(ao);
			}
			ao.srcFunc = "onkeypress";
		}
		if(!ao.srcObj[ao.srcFunc]){ return null; } // prevent un-necessaray joinpoint creation
		var mjp = dojo.event.MethodJoinPoint.getForMethod(ao.srcObj, ao.srcFunc, true);
		mjp.removeAdvice(ao.adviceObj, ao.adviceFunc, ao.adviceType, ao.once); // a MethodJoinPoint object
		return mjp;
	}

	this.kwDisconnect = function(kwArgs){
		// summary:
		//		Takes the same parameters as dojo.event.kwConnect() but
		//		destroys an existing connection instead of building a new one.
		return this._kwConnectImpl(kwArgs, true);
	}
}

// exactly one of these is created whenever a method with a joint point is run,
// if there is at least one 'around' advice.
dojo.event.MethodInvocation = function(/*dojo.event.MethodJoinPoint*/join_point, /*Object*/obj, /*Array*/args){
	// summary:
	//		a class the models the call into a function. This is used under the
	//		covers for all method invocations on both ends of a
	//		connect()-wrapped function dispatch. This allows us to "pickle"
	//		calls, such as in the case of around advice.
	// join_point:
	//		a dojo.event.MethodJoinPoint object that represents a connection
	// obj:
	//		the scope the call will execute in
	// args:
	//		an array of parameters that will get passed to the callee
	this.jp_ = join_point;
	this.object = obj;
	this.args = [];
	// make sure we don't lock into a mutable object which can change under us.
	// It's ok if the individual items change, though.
	for(var x=0; x<args.length; x++){
		this.args[x] = args[x];
	}
	// the index of the 'around' that is currently being executed.
	this.around_index = -1;
}

dojo.event.MethodInvocation.prototype.proceed = function(){
	// summary:
	//		proceed with the method call that's represented by this invocation
	//		object
	this.around_index++;
	if(this.around_index >= this.jp_.around.length){
		return this.jp_.object[this.jp_.methodname].apply(this.jp_.object, this.args);
		// return this.jp_.run_before_after(this.object, this.args);
	}else{
		var ti = this.jp_.around[this.around_index];
		var mobj = ti[0]||dj_global;
		var meth = ti[1];
		return mobj[meth].call(mobj, this);
	}
} 


dojo.event.MethodJoinPoint = function(/*Object*/obj, /*String*/funcName){
	this.object = obj||dj_global;
	this.methodname = funcName;
	this.methodfunc = this.object[funcName];
	this.squelch = false;
	// this.before = [];
	// this.after = [];
	// this.around = [];
}

dojo.event.MethodJoinPoint.getForMethod = function(/*Object*/obj, /*String*/funcName){
	// summary:
	//		"static" class function for returning a MethodJoinPoint from a
	//		scoped function. If one doesn't exist, one is created.
	// obj:
	//		the scope to search for the function in
	// funcName:
	//		the name of the function to return a MethodJoinPoint for
	if(!obj){ obj = dj_global; }
	if(!obj[funcName]){
		// supply a do-nothing method implementation
		obj[funcName] = function(){};
		if(!obj[funcName]){
			// e.g. cannot add to inbuilt objects in IE6
			dojo.raise("Cannot set do-nothing method on that object "+funcName);
		}
	}else if((!dojo.lang.isFunction(obj[funcName]))&&(!dojo.lang.isAlien(obj[funcName]))){
		// FIXME: should we throw an exception here instead?
		return null; 
	}
	// we hide our joinpoint instance in obj[funcName + '$joinpoint']
	var jpname = funcName + "$joinpoint";
	var jpfuncname = funcName + "$joinpoint$method";
	var joinpoint = obj[jpname];
	if(!joinpoint){
		var isNode = false;
		if(dojo.event["browser"]){
			if( (obj["attachEvent"])||
				(obj["nodeType"])||
				(obj["addEventListener"]) ){
				isNode = true;
				dojo.event.browser.addClobberNodeAttrs(obj, [jpname, jpfuncname, funcName]);
			}
		}
		var origArity = obj[funcName].length;
		obj[jpfuncname] = obj[funcName];
		// joinpoint = obj[jpname] = new dojo.event.MethodJoinPoint(obj, funcName);
		joinpoint = obj[jpname] = new dojo.event.MethodJoinPoint(obj, jpfuncname);
		obj[funcName] = function(){ 
			var args = [];

			if((isNode)&&(!arguments.length)){
				var evt = null;
				try{
					if(obj.ownerDocument){
						evt = obj.ownerDocument.parentWindow.event;
					}else if(obj.documentElement){
						evt = obj.documentElement.ownerDocument.parentWindow.event;
					}else if(obj.event){ //obj is a window
						evt = obj.event;
					}else{
						evt = window.event;
					}
				}catch(e){
					evt = window.event;
				}

				if(evt){
					args.push(dojo.event.browser.fixEvent(evt, this));
				}
			}else{
				for(var x=0; x<arguments.length; x++){
					if((x==0)&&(isNode)&&(dojo.event.browser.isEvent(arguments[x]))){
						args.push(dojo.event.browser.fixEvent(arguments[x], this));
					}else{
						args.push(arguments[x]);
					}
				}
			}
			// return joinpoint.run.apply(joinpoint, arguments); 
			return joinpoint.run.apply(joinpoint, args); 
		}
		obj[funcName].__preJoinArity = origArity;
	}
	return joinpoint; // dojo.event.MethodJoinPoint
}

dojo.lang.extend(dojo.event.MethodJoinPoint, {
	unintercept: function(){
		// summary: 
		//		destroy the connection to all listeners that may have been
		//		registered on this joinpoint
		this.object[this.methodname] = this.methodfunc;
		this.before = [];
		this.after = [];
		this.around = [];
	},

	disconnect: dojo.lang.forward("unintercept"),

	run: function(){
		// summary:
		//		execute the connection represented by this join point. The
		//		arguments passed to run() will be passed to the function and
		//		its listeners.
		var obj = this.object||dj_global;
		var args = arguments;

		// optimization. We only compute once the array version of the arguments
		// pseudo-arr in order to prevent building it each time advice is unrolled.
		var aargs = [];
		for(var x=0; x<args.length; x++){
			aargs[x] = args[x];
		}

		var unrollAdvice  = function(marr){ 
			if(!marr){
				dojo.debug("Null argument to unrollAdvice()");
				return;
			}
		  
			var callObj = marr[0]||dj_global;
			var callFunc = marr[1];
			
			if(!callObj[callFunc]){
				dojo.raise("function \"" + callFunc + "\" does not exist on \"" + callObj + "\"");
			}
			
			var aroundObj = marr[2]||dj_global;
			var aroundFunc = marr[3];
			var msg = marr[6];
			var undef;

			var to = {
				args: [],
				jp_: this,
				object: obj,
				proceed: function(){
					return callObj[callFunc].apply(callObj, to.args);
				}
			};
			to.args = aargs;

			var delay = parseInt(marr[4]);
			var hasDelay = ((!isNaN(delay))&&(marr[4]!==null)&&(typeof marr[4] != "undefined"));
			if(marr[5]){
				var rate = parseInt(marr[5]);
				var cur = new Date();
				var timerSet = false;
				if((marr["last"])&&((cur-marr.last)<=rate)){
					if(dojo.event._canTimeout){
						if(marr["delayTimer"]){
							clearTimeout(marr.delayTimer);
						}
						var tod = parseInt(rate*2); // is rate*2 naive?
						var mcpy = dojo.lang.shallowCopy(marr);
						marr.delayTimer = setTimeout(function(){
							// FIXME: on IE at least, event objects from the
							// browser can go out of scope. How (or should?) we
							// deal with it?
							mcpy[5] = 0;
							unrollAdvice(mcpy);
						}, tod);
					}
					return;
				}else{
					marr.last = cur;
				}
			}

			// FIXME: need to enforce rates for a connection here!

			if(aroundFunc){
				// NOTE: around advice can't delay since we might otherwise depend
				// on execution order!
				aroundObj[aroundFunc].call(aroundObj, to);
			}else{
				// var tmjp = dojo.event.MethodJoinPoint.getForMethod(obj, methname);
				if((hasDelay)&&((dojo.render.html)||(dojo.render.svg))){  // FIXME: the render checks are grotty!
					dj_global["setTimeout"](function(){
						if(msg){
							callObj[callFunc].call(callObj, to); 
						}else{
							callObj[callFunc].apply(callObj, args); 
						}
					}, delay);
				}else{ // many environments can't support delay!
					if(msg){
						callObj[callFunc].call(callObj, to); 
					}else{
						callObj[callFunc].apply(callObj, args); 
					}
				}
			}
		}

		var unRollSquelch = function(){
			if(this.squelch){
				try{
					return unrollAdvice.apply(this, arguments);
				}catch(e){ 
					dojo.debug(e);
				}
			}else{
				return unrollAdvice.apply(this, arguments);
			}
		}

		if((this["before"])&&(this.before.length>0)){
			// pass a cloned array, if this event disconnects this event forEach on this.before wont work
			dojo.lang.forEach(this.before.concat(new Array()), unRollSquelch);
		}

		var result;
		try{
			if((this["around"])&&(this.around.length>0)){
				var mi = new dojo.event.MethodInvocation(this, obj, args);
				result = mi.proceed();
			}else if(this.methodfunc){
				result = this.object[this.methodname].apply(this.object, args);
			}
		}catch(e){ 
			if(!this.squelch){ 
				dojo.debug(e,"when calling",this.methodname,"on",this.object,"with arguments",args);
				dojo.raise(e);
			} 
		}

		if((this["after"])&&(this.after.length>0)){
			// see comment on this.before above
			dojo.lang.forEach(this.after.concat(new Array()), unRollSquelch);
		}

		return (this.methodfunc) ? result : null;
	},

	getArr: function(/*String*/kind){
		// summary: return a list of listeners of the past "kind"
		// kind:
		//		can be one of: "before", "after", "around", "before-around", or
		//		"after-around"
		var type = "after";
		// FIXME: we should be able to do this through props or Array.in()
		if((typeof kind == "string")&&(kind.indexOf("before")!=-1)){
			type = "before";
		}else if(kind=="around"){
			type = "around";
		}
		if(!this[type]){ this[type] = []; }
		return this[type]; // Array
	},

	kwAddAdvice: function(/*Object*/args){
		// summary:
		//		adds advice to the joinpoint with arguments in a map
		// args:
		// 		An object that can have the following properties:
		//			- adviceType
		//			- adviceObj
		//			- adviceFunc 
		//			- aroundObj
		//			- aroundFunc
		//			- once
		//			- delay
		//			- rate
		//			- adviceMsg
		this.addAdvice(	args["adviceObj"], args["adviceFunc"], 
						args["aroundObj"], args["aroundFunc"], 
						args["adviceType"], args["precedence"], 
						args["once"], args["delay"], args["rate"], 
						args["adviceMsg"]);
	},

	addAdvice: function(	thisAdviceObj, thisAdvice, 
							thisAroundObj, thisAround, 
							adviceType, precedence, 
							once, delay, rate, asMessage){
		// summary:
		//		add advice to this joinpoint using positional parameters
		// thisAdviceObj:
		//		the scope in which to locate/execute the named adviceFunc.
		// thisAdviceFunc:
		//		the name of the function being conected
		// thisAroundObj:
		//		the scope in which to locate/execute the named aroundFunc.
		// thisAroundFunc:
		//		the name of the function that will be used to mediate the
		//		advice call.
		// adviceType: 
		//		Optional. String. One of "before", "after", "around",
		//		"before-around", or "after-around". FIXME
		// once:
		//		boolean that determines whether or not this advice will create
		//		a new connection if an identical advice set has already been
		//		provided. Defaults to "false".
		// delay:
		//		an optional delay (in ms), as an integer, for dispatch of a
		//		listener after the source has been fired.
		// rate:
		//		an optional rate throttling parameter (integer, in ms). When
		//		specified, this particular connection will not fire more than
		//		once in the interval specified by the rate
		// adviceMsg:
		//		boolean. Should the listener have all the parameters passed in
		//		as a single argument?
		var arr = this.getArr(adviceType);
		if(!arr){
			dojo.raise("bad this: " + this);
		}

		var ao = [thisAdviceObj, thisAdvice, thisAroundObj, thisAround, delay, rate, asMessage];
		
		if(once){
			if(this.hasAdvice(thisAdviceObj, thisAdvice, adviceType, arr) >= 0){
				return;
			}
		}

		if(precedence == "first"){
			arr.unshift(ao);
		}else{
			arr.push(ao);
		}
	},

	hasAdvice: function(thisAdviceObj, thisAdvice, adviceType, arr){
		// summary:
		//		returns the array index of the first existing connection
		//		betweened the passed advice and this joinpoint. Will be -1 if
		//		none exists.
		// thisAdviceObj:
		//		the scope in which to locate/execute the named adviceFunc.
		// thisAdviceFunc:
		//		the name of the function being conected
		// adviceType: 
		//		Optional. String. One of "before", "after", "around",
		//		"before-around", or "after-around". FIXME
		// arr:
		//		Optional. The list of advices to search. Will be found via
		//		adviceType if not passed
		if(!arr){ arr = this.getArr(adviceType); }
		var ind = -1;
		for(var x=0; x<arr.length; x++){
			var aao = (typeof thisAdvice == "object") ? (new String(thisAdvice)).toString() : thisAdvice;
			var a1o = (typeof arr[x][1] == "object") ? (new String(arr[x][1])).toString() : arr[x][1];
			if((arr[x][0] == thisAdviceObj)&&(a1o == aao)){
				ind = x;
			}
		}
		return ind; // Integer
	},

	removeAdvice: function(thisAdviceObj, thisAdvice, adviceType, once){
		// summary:
		//		returns the array index of the first existing connection
		//		betweened the passed advice and this joinpoint. Will be -1 if
		//		none exists.
		// thisAdviceObj:
		//		the scope in which to locate/execute the named adviceFunc.
		// thisAdviceFunc:
		//		the name of the function being conected
		// adviceType: 
		//		Optional. String. One of "before", "after", "around",
		//		"before-around", or "after-around". FIXME
		// once:
		//		Optional. Should this only remove the first occurance of the
		//		connection?
		var arr = this.getArr(adviceType);
		var ind = this.hasAdvice(thisAdviceObj, thisAdvice, adviceType, arr);
		if(ind == -1){
			return false;
		}
		while(ind != -1){
			arr.splice(ind, 1);
			if(once){ break; }
			ind = this.hasAdvice(thisAdviceObj, thisAdvice, adviceType, arr);
		}
		return true;
	}
});

dojo.provide("dojo.event.topic");

dojo.event.topic = new function(){
	this.topics = {};

	this.getTopic = function(/*String*/topic){
		// summary:
		//		returns a topic implementation object of type
		//		dojo.event.topic.TopicImpl
		// topic:
		//		a unique, opaque string that names the topic
		if(!this.topics[topic]){
			this.topics[topic] = new this.TopicImpl(topic);
		}
		return this.topics[topic]; // a dojo.event.topic.TopicImpl object
	}

	this.registerPublisher = function(/*String*/topic, /*Object*/obj, /*String*/funcName){
		// summary:
		//		registers a function as a publisher on a topic. Subsequent
		//		calls to the function will cause a publish event on the topic
		//		with the arguments passed to the function passed to registered
		//		listeners.
		// topic: 
		//		a unique, opaque string that names the topic
		// obj:
		//		the scope to locate the function in
		// funcName:
		//		the name of the function to register
		var topic = this.getTopic(topic);
		topic.registerPublisher(obj, funcName);
	}

	this.subscribe = function(/*String*/topic, /*Object*/obj, /*String*/funcName){
		// summary:
		//		susbscribes the function to the topic. Subsequent events
		//		dispached to the topic will create a function call for the
		//		obj.funcName() function.
		// topic: 
		//		a unique, opaque string that names the topic
		// obj:
		//		the scope to locate the function in
		// funcName:
		//		the name of the function to being registered as a listener
		var topic = this.getTopic(topic);
		topic.subscribe(obj, funcName);
	}

	this.unsubscribe = function(/*String*/topic, /*Object*/obj, /*String*/funcName){
		// summary:
		//		unsubscribes the obj.funcName() from the topic
		// topic: 
		//		a unique, opaque string that names the topic
		// obj:
		//		the scope to locate the function in
		// funcName:
		//		the name of the function to being unregistered as a listener
		var topic = this.getTopic(topic);
		topic.unsubscribe(obj, funcName);
	}

	this.destroy = function(/*String*/topic){
		// summary: 
		//		destroys the topic and unregisters all listeners
		// topic:
		//		a unique, opaque string that names the topic
		this.getTopic(topic).destroy();
		delete this.topics[topic];
	}

	this.publishApply = function(/*String*/topic, /*Array*/args){
		// summary: 
		//		dispatches an event to the topic using the args array as the
		//		source for the call arguments to each listener. This is similar
		//		to JavaScript's built-in Function.apply()
		// topic:
		//		a unique, opaque string that names the topic
		// args:
		//		the arguments to be passed into listeners of the topic
		var topic = this.getTopic(topic);
		topic.sendMessage.apply(topic, args);
	}

	this.publish = function(/*String*/topic, /*Object*/message){
		// summary: 
		//		manually "publish" to the passed topic
		// topic:
		//		a unique, opaque string that names the topic
		// message:
		//		can be an array of parameters (similar to publishApply), or
		//		will be treated as one of many arguments to be passed along in
		//		a "flat" unrolling
		var topic = this.getTopic(topic);
		// if message is an array, we treat it as a set of arguments,
		// otherwise, we just pass on the arguments passed in as-is
		var args = [];
		// could we use concat instead here?
		for(var x=1; x<arguments.length; x++){
			args.push(arguments[x]);
		}
		topic.sendMessage.apply(topic, args);
	}
}

dojo.event.topic.TopicImpl = function(topicName){
	// summary: a class to represent topics

	this.topicName = topicName;

	this.subscribe = function(/*Object*/listenerObject, /*Function or String*/listenerMethod){
		// summary:
		//		use dojo.event.connect() to attach the passed listener to the
		//		topic represented by this object
		// listenerObject:
		//		if a string and listenerMethod is ommitted, this is treated as
		//		the name of a function in the global namespace. If
		//		listenerMethod is provided, this is the scope to find/execute
		//		the function in.
		// listenerMethod:
		//		Optional. The function to register.
		var tf = listenerMethod||listenerObject;
		var to = (!listenerMethod) ? dj_global : listenerObject;
		return dojo.event.kwConnect({ // dojo.event.MethodJoinPoint
			srcObj:		this, 
			srcFunc:	"sendMessage", 
			adviceObj:	to,
			adviceFunc: tf
		});
	}

	this.unsubscribe = function(/*Object*/listenerObject, /*Function or String*/listenerMethod){
		// summary:
		//		use dojo.event.disconnect() to attach the passed listener to the
		//		topic represented by this object
		// listenerObject:
		//		if a string and listenerMethod is ommitted, this is treated as
		//		the name of a function in the global namespace. If
		//		listenerMethod is provided, this is the scope to find the
		//		function in.
		// listenerMethod:
		//		Optional. The function to unregister.
		var tf = (!listenerMethod) ? listenerObject : listenerMethod;
		var to = (!listenerMethod) ? null : listenerObject;
		return dojo.event.kwDisconnect({ // dojo.event.MethodJoinPoint
			srcObj:		this, 
			srcFunc:	"sendMessage", 
			adviceObj:	to,
			adviceFunc: tf
		});
	}

	this._getJoinPoint = function(){
		return dojo.event.MethodJoinPoint.getForMethod(this, "sendMessage");
	}

	this.setSquelch = function(/*Boolean*/shouldSquelch){
		// summary: 
		//		determine whether or not exceptions in the calling of a
		//		listener in the chain should stop execution of the chain.
		this._getJoinPoint().squelch = shouldSquelch;
	}

	this.destroy = function(){
		// summary: disconnects all listeners from this topic
		this._getJoinPoint().disconnect();
	}

	this.registerPublisher = function(	/*Object*/publisherObject, 
										/*Function or String*/publisherMethod){
		// summary:
		//		registers the passed function as a publisher on this topic.
		//		Each time the function is called, an event will be published on
		//		this topic.
		// publisherObject:
		//		if a string and listenerMethod is ommitted, this is treated as
		//		the name of a function in the global namespace. If
		//		listenerMethod is provided, this is the scope to find the
		//		function in.
		// publisherMethod:
		//		Optional. The function to register.
		dojo.event.connect(publisherObject, publisherMethod, this, "sendMessage");
	}

	this.sendMessage = function(message){
		// summary: a stub to be called when a message is sent to the topic.

		// The message has been propagated
	}
}


dojo.provide("dojo.event.browser");

// FIXME: any particular reason this is in the global scope?
dojo._ie_clobber = new function(){
	this.clobberNodes = [];

	function nukeProp(node, prop){
		// try{ node.removeAttribute(prop); 	}catch(e){ /* squelch */ }
		try{ node[prop] = null; 			}catch(e){ /* squelch */ }
		try{ delete node[prop]; 			}catch(e){ /* squelch */ }
		// FIXME: JotLive needs this, but I'm not sure if it's too slow or not
		try{ node.removeAttribute(prop);	}catch(e){ /* squelch */ }
	}

	this.clobber = function(nodeRef){
		var na;
		var tna;
		if(nodeRef){
			tna = nodeRef.all || nodeRef.getElementsByTagName("*");
			na = [nodeRef];
			for(var x=0; x<tna.length; x++){
				// if we're gonna be clobbering the thing, at least make sure
				// we aren't trying to do it twice
				if(tna[x]["__doClobber__"]){
					na.push(tna[x]);
				}
			}
		}else{
			try{ window.onload = null; }catch(e){}
			na = (this.clobberNodes.length) ? this.clobberNodes : document.all;
		}
		tna = null;
		var basis = {};
		for(var i = na.length-1; i>=0; i=i-1){
			var el = na[i];
			try{
				if(el && el["__clobberAttrs__"]){
					for(var j=0; j<el.__clobberAttrs__.length; j++){
						nukeProp(el, el.__clobberAttrs__[j]);
					}
					nukeProp(el, "__clobberAttrs__");
					nukeProp(el, "__doClobber__");
				}
			}catch(e){ /* squelch! */};
		}
		na = null;
	}
}

if(dojo.render.html.ie){
	dojo.addOnUnload(function(){
		dojo._ie_clobber.clobber();
		try{
			if((dojo["widget"])&&(dojo.widget["manager"])){
				dojo.widget.manager.destroyAll();
			}
		}catch(e){}

		// Workaround for IE leak recommended in ticket #1727 by schallm
		if(dojo.widget){
			for(var name in dojo.widget._templateCache){
				if(dojo.widget._templateCache[name].node){
					dojo.dom.destroyNode(dojo.widget._templateCache[name].node);
					dojo.widget._templateCache[name].node = null;
					delete dojo.widget._templateCache[name].node;
				}
			}
		}

		try{ window.onload = null; }catch(e){}
		try{ window.onunload = null; }catch(e){}
		dojo._ie_clobber.clobberNodes = [];
		// CollectGarbage();
	});
}

dojo.event.browser = new function(){

	var clobberIdx = 0;

	this.normalizedEventName = function(/*String*/eventName){
		switch(eventName){
			case "CheckboxStateChange":
			case "DOMAttrModified":
			case "DOMMenuItemActive":
			case "DOMMenuItemInactive":
			case "DOMMouseScroll":
			case "DOMNodeInserted":
			case "DOMNodeRemoved":
			case "RadioStateChange":
				return eventName;
				break;
			default:
				return eventName.toLowerCase();
				break;
		}
	}
	
	this.clean = function(/*DOMNode*/node){
		// summary:
		//		removes native event handlers so that destruction of the node
		//		will not leak memory. On most browsers this is a no-op, but
		//		it's critical for manual node removal on IE.
		// node:
		//		A DOM node. All of it's children will also be cleaned.
		if(dojo.render.html.ie){ 
			dojo._ie_clobber.clobber(node);
		}
	}

	this.addClobberNode = function(/*DOMNode*/node){
		// summary:
		//		register the passed node to support event stripping
		// node:
		//		A DOM node
		if(!dojo.render.html.ie){ return; }
		if(!node["__doClobber__"]){
			node.__doClobber__ = true;
			dojo._ie_clobber.clobberNodes.push(node);
			// this might not be the most efficient thing to do, but it's
			// much less error prone than other approaches which were
			// previously tried and failed
			node.__clobberAttrs__ = [];
		}
	}

	this.addClobberNodeAttrs = function(/*DOMNode*/node, /*Array*/props){
		// summary:
		//		register the passed node to support event stripping
		// node:
		//		A DOM node to stip properties from later
		// props:
		//		A list of propeties to strip from the node
		if(!dojo.render.html.ie){ return; }
		this.addClobberNode(node);
		for(var x=0; x<props.length; x++){
			node.__clobberAttrs__.push(props[x]);
		}
	}

	this.removeListener = function(	/*DOMNode*/ node, 
									/*String*/	evtName, 
									/*Function*/fp, 
									/*Boolean*/	capture){
		// summary:
		//		clobbers the listener from the node
		// evtName:
		//		the name of the handler to remove the function from
		// node:
		//		DOM node to attach the event to
		// fp:
		//		the function to register
		// capture:
		//		Optional. should this listener prevent propigation?
		if(!capture){ var capture = false; }
		evtName = dojo.event.browser.normalizedEventName(evtName);
		if( (evtName == "onkey") || (evtName == "key") ){
			if(dojo.render.html.ie){
				this.removeListener(node, "onkeydown", fp, capture);
			}
			evtName = "onkeypress";
		}
		if(evtName.substr(0,2)=="on"){ evtName = evtName.substr(2); }
		// FIXME: this is mostly a punt, we aren't actually doing anything on IE
		if(node.removeEventListener){
			node.removeEventListener(evtName, fp, capture);
		}
	}

	this.addListener = function(/*DOMNode*/node, /*String*/evtName, /*Function*/fp, /*Boolean*/capture, /*Boolean*/dontFix){
		// summary:
		//		adds a listener to the node
		// evtName:
		//		the name of the handler to add the listener to can be either of
		//		the form "onclick" or "click"
		// node:
		//		DOM node to attach the event to
		// fp:
		//		the function to register
		// capture:
		//		Optional. Should this listener prevent propigation?
		// dontFix:
		//		Optional. Should we avoid registering a new closure around the
		//		listener to enable fixEvent for dispatch of the registered
		//		function?
		if(!node){ return; } // FIXME: log and/or bail?
		if(!capture){ var capture = false; }
		evtName = dojo.event.browser.normalizedEventName(evtName);
		if( (evtName == "onkey") || (evtName == "key") ){
			if(dojo.render.html.ie){
				this.addListener(node, "onkeydown", fp, capture, dontFix);
			}
			evtName = "onkeypress";
		}
		if(evtName.substr(0,2)!="on"){ evtName = "on"+evtName; }

		if(!dontFix){
			// build yet another closure around fp in order to inject fixEvent
			// around the resulting event
			var newfp = function(evt){
				if(!evt){ evt = window.event; }
				var ret = fp(dojo.event.browser.fixEvent(evt, this));
				if(capture){
					dojo.event.browser.stopEvent(evt);
				}
				return ret;
			}
		}else{
			newfp = fp;
		}

		if(node.addEventListener){ 
			node.addEventListener(evtName.substr(2), newfp, capture);
			return newfp;
		}else{
			if(typeof node[evtName] == "function" ){
				var oldEvt = node[evtName];
				node[evtName] = function(e){
					oldEvt(e);
					return newfp(e);
				}
			}else{
				node[evtName]=newfp;
			}
			if(dojo.render.html.ie){
				this.addClobberNodeAttrs(node, [evtName]);
			}
			return newfp;
		}
	}

	this.isEvent = function(/*Object*/obj){
		// summary: 
		//		Tries to determine whether or not the object is a DOM event.

		// FIXME: event detection hack ... could test for additional attributes
		// if necessary
		return (typeof obj != "undefined")&&(obj)&&(typeof Event != "undefined")&&(obj.eventPhase); // Boolean
		// Event does not support instanceof in Opera, otherwise:
		//return (typeof Event != "undefined")&&(obj instanceof Event);
	}

	this.currentEvent = null;
	
	this.callListener = function(/*Function*/listener, /*DOMNode*/curTarget){
		// summary:
		//		calls the specified listener in the context of the passed node
		//		with the current DOM event object as the only parameter
		// listener:
		//		the function to call
		// curTarget:
		//		the Node to call the function in the scope of
		if(typeof listener != 'function'){
			dojo.raise("listener not a function: " + listener);
		}
		dojo.event.browser.currentEvent.currentTarget = curTarget;
		return listener.call(curTarget, dojo.event.browser.currentEvent);
	}

	this._stopPropagation = function(){
		dojo.event.browser.currentEvent.cancelBubble = true; 
	}

	this._preventDefault = function(){
		dojo.event.browser.currentEvent.returnValue = false;
	}

	this.keys = {
		KEY_BACKSPACE: 8,
		KEY_TAB: 9,
		KEY_CLEAR: 12,
		KEY_ENTER: 13,
		KEY_SHIFT: 16,
		KEY_CTRL: 17,
		KEY_ALT: 18,
		KEY_PAUSE: 19,
		KEY_CAPS_LOCK: 20,
		KEY_ESCAPE: 27,
		KEY_SPACE: 32,
		KEY_PAGE_UP: 33,
		KEY_PAGE_DOWN: 34,
		KEY_END: 35,
		KEY_HOME: 36,
		KEY_LEFT_ARROW: 37,
		KEY_UP_ARROW: 38,
		KEY_RIGHT_ARROW: 39,
		KEY_DOWN_ARROW: 40,
		KEY_INSERT: 45,
		KEY_DELETE: 46,
		KEY_HELP: 47,
		KEY_LEFT_WINDOW: 91,
		KEY_RIGHT_WINDOW: 92,
		KEY_SELECT: 93,
		KEY_NUMPAD_0: 96,
		KEY_NUMPAD_1: 97,
		KEY_NUMPAD_2: 98,
		KEY_NUMPAD_3: 99,
		KEY_NUMPAD_4: 100,
		KEY_NUMPAD_5: 101,
		KEY_NUMPAD_6: 102,
		KEY_NUMPAD_7: 103,
		KEY_NUMPAD_8: 104,
		KEY_NUMPAD_9: 105,
		KEY_NUMPAD_MULTIPLY: 106,
		KEY_NUMPAD_PLUS: 107,
		KEY_NUMPAD_ENTER: 108,
		KEY_NUMPAD_MINUS: 109,
		KEY_NUMPAD_PERIOD: 110,
		KEY_NUMPAD_DIVIDE: 111,
		KEY_F1: 112,
		KEY_F2: 113,
		KEY_F3: 114,
		KEY_F4: 115,
		KEY_F5: 116,
		KEY_F6: 117,
		KEY_F7: 118,
		KEY_F8: 119,
		KEY_F9: 120,
		KEY_F10: 121,
		KEY_F11: 122,
		KEY_F12: 123,
		KEY_F13: 124,
		KEY_F14: 125,
		KEY_F15: 126,
		KEY_NUM_LOCK: 144,
		KEY_SCROLL_LOCK: 145
	};

	// reverse lookup
	this.revKeys = [];
	for(var key in this.keys){
		this.revKeys[this.keys[key]] = key;
	}

	this.fixEvent = function(/*Event*/evt, /*DOMNode*/sender){
		// summary:
		//		normalizes properties on the event object including event
		//		bubbling methods, keystroke normalization, and x/y positions
		// evt: the native event object
		// sender: the node to treat as "currentTarget"
		if(!evt){
			if(window["event"]){
				evt = window.event;
			}
		}
		
		if((evt["type"])&&(evt["type"].indexOf("key") == 0)){ // key events
			evt.keys = this.revKeys;
			// FIXME: how can we eliminate this iteration?
			for(var key in this.keys){
				evt[key] = this.keys[key];
			}
			if(evt["type"] == "keydown" && dojo.render.html.ie){
				switch(evt.keyCode){
					case evt.KEY_SHIFT:
					case evt.KEY_CTRL:
					case evt.KEY_ALT:
					case evt.KEY_CAPS_LOCK:
					case evt.KEY_LEFT_WINDOW:
					case evt.KEY_RIGHT_WINDOW:
					case evt.KEY_SELECT:
					case evt.KEY_NUM_LOCK:
					case evt.KEY_SCROLL_LOCK:
					// I'll get these in keypress after the OS munges them based on numlock
					case evt.KEY_NUMPAD_0:
					case evt.KEY_NUMPAD_1:
					case evt.KEY_NUMPAD_2:
					case evt.KEY_NUMPAD_3:
					case evt.KEY_NUMPAD_4:
					case evt.KEY_NUMPAD_5:
					case evt.KEY_NUMPAD_6:
					case evt.KEY_NUMPAD_7:
					case evt.KEY_NUMPAD_8:
					case evt.KEY_NUMPAD_9:
					case evt.KEY_NUMPAD_PERIOD:
						break; // just ignore the keys that can morph
					case evt.KEY_NUMPAD_MULTIPLY:
					case evt.KEY_NUMPAD_PLUS:
					case evt.KEY_NUMPAD_ENTER:
					case evt.KEY_NUMPAD_MINUS:
					case evt.KEY_NUMPAD_DIVIDE:
						break; // I could handle these but just pick them up in keypress
					case evt.KEY_PAUSE:
					case evt.KEY_TAB:
					case evt.KEY_BACKSPACE:
					case evt.KEY_ENTER:
					case evt.KEY_ESCAPE:
					case evt.KEY_PAGE_UP:
					case evt.KEY_PAGE_DOWN:
					case evt.KEY_END:
					case evt.KEY_HOME:
					case evt.KEY_LEFT_ARROW:
					case evt.KEY_UP_ARROW:
					case evt.KEY_RIGHT_ARROW:
					case evt.KEY_DOWN_ARROW:
					case evt.KEY_INSERT:
					case evt.KEY_DELETE:
					case evt.KEY_F1:
					case evt.KEY_F2:
					case evt.KEY_F3:
					case evt.KEY_F4:
					case evt.KEY_F5:
					case evt.KEY_F6:
					case evt.KEY_F7:
					case evt.KEY_F8:
					case evt.KEY_F9:
					case evt.KEY_F10:
					case evt.KEY_F11:
					case evt.KEY_F12:
					case evt.KEY_F12:
					case evt.KEY_F13:
					case evt.KEY_F14:
					case evt.KEY_F15:
					case evt.KEY_CLEAR:
					case evt.KEY_HELP:
						evt.key = evt.keyCode;
						break;
					default:
						if(evt.ctrlKey || evt.altKey){
							var unifiedCharCode = evt.keyCode;
							// if lower case but keycode is uppercase, convert it
							if(unifiedCharCode >= 65 && unifiedCharCode <= 90 && evt.shiftKey == false){
								unifiedCharCode += 32;
							}
							if(unifiedCharCode >= 1 && unifiedCharCode <= 26 && evt.ctrlKey){
								unifiedCharCode += 96; // 001-032 = ctrl+[a-z]
							}
							evt.key = String.fromCharCode(unifiedCharCode);
						}
				}
			} else if(evt["type"] == "keypress"){
				if(dojo.render.html.opera){
					if(evt.which == 0){
						evt.key = evt.keyCode;
					}else if(evt.which > 0){
						switch(evt.which){
							case evt.KEY_SHIFT:
							case evt.KEY_CTRL:
							case evt.KEY_ALT:
							case evt.KEY_CAPS_LOCK:
							case evt.KEY_NUM_LOCK:
							case evt.KEY_SCROLL_LOCK:
								break;
							case evt.KEY_PAUSE:
							case evt.KEY_TAB:
							case evt.KEY_BACKSPACE:
							case evt.KEY_ENTER:
							case evt.KEY_ESCAPE:
								evt.key = evt.which;
								break;
							default:
								var unifiedCharCode = evt.which;
								if((evt.ctrlKey || evt.altKey || evt.metaKey) && (evt.which >= 65 && evt.which <= 90 && evt.shiftKey == false)){
									unifiedCharCode += 32;
								}
								evt.key = String.fromCharCode(unifiedCharCode);
						}
					}
				}else if(dojo.render.html.ie){ // catch some IE keys that are hard to get in keyDown
					// key combinations were handled in onKeyDown
					if(!evt.ctrlKey && !evt.altKey && evt.keyCode >= evt.KEY_SPACE){
						evt.key = String.fromCharCode(evt.keyCode);
					}
				}else if(dojo.render.html.safari){
					switch(evt.keyCode){
						case 25: evt.key = evt.KEY_TAB; evt.shift = true;break;
						case 63232: evt.key = evt.KEY_UP_ARROW; break;
						case 63233: evt.key = evt.KEY_DOWN_ARROW; break;
						case 63234: evt.key = evt.KEY_LEFT_ARROW; break;
						case 63235: evt.key = evt.KEY_RIGHT_ARROW; break;
						case 63236: evt.key = evt.KEY_F1; break;
						case 63237: evt.key = evt.KEY_F2; break;
						case 63238: evt.key = evt.KEY_F3; break;
						case 63239: evt.key = evt.KEY_F4; break;
						case 63240: evt.key = evt.KEY_F5; break;
						case 63241: evt.key = evt.KEY_F6; break;
						case 63242: evt.key = evt.KEY_F7; break;
						case 63243: evt.key = evt.KEY_F8; break;
						case 63244: evt.key = evt.KEY_F9; break;
						case 63245: evt.key = evt.KEY_F10; break;
						case 63246: evt.key = evt.KEY_F11; break;
						case 63247: evt.key = evt.KEY_F12; break;
						case 63250: evt.key = evt.KEY_PAUSE; break;
						case 63272: evt.key = evt.KEY_DELETE; break;
						case 63273: evt.key = evt.KEY_HOME; break;
						case 63275: evt.key = evt.KEY_END; break;
						case 63276: evt.key = evt.KEY_PAGE_UP; break;
						case 63277: evt.key = evt.KEY_PAGE_DOWN; break;
						case 63302: evt.key = evt.KEY_INSERT; break;
						case 63248://prtscr
						case 63249://scrolllock
						case 63289://numlock
							break;
						default: 
							evt.key = evt.charCode >= evt.KEY_SPACE ? String.fromCharCode(evt.charCode) : evt.keyCode;
					}
				}else{
					evt.key = evt.charCode > 0 ? String.fromCharCode(evt.charCode) : evt.keyCode;
				}
			}
		}
		if(dojo.render.html.ie){
			if(!evt.target){ evt.target = evt.srcElement; }
			if(!evt.currentTarget){ evt.currentTarget = (sender ? sender : evt.srcElement); }
			if(!evt.layerX){ evt.layerX = evt.offsetX; }
			if(!evt.layerY){ evt.layerY = evt.offsetY; }
			// FIXME: scroll position query is duped from dojo.html to avoid dependency on that entire module
			// DONOT replace the following to use dojo.body(), in IE, document.documentElement should be used
			// here rather than document.body
			var doc = (evt.srcElement && evt.srcElement.ownerDocument) ? evt.srcElement.ownerDocument : document;
			var docBody = ((dojo.render.html.ie55)||(doc["compatMode"] == "BackCompat")) ? doc.body : doc.documentElement;
			if(!evt.pageX){ evt.pageX = evt.clientX + (docBody.scrollLeft || 0) }
			if(!evt.pageY){ evt.pageY = evt.clientY + (docBody.scrollTop || 0) }
			// mouseover
			if(evt.type == "mouseover"){ evt.relatedTarget = evt.fromElement; }
			// mouseout
			if(evt.type == "mouseout"){ evt.relatedTarget = evt.toElement; }
			this.currentEvent = evt;
			evt.callListener = this.callListener;
			evt.stopPropagation = this._stopPropagation;
			evt.preventDefault = this._preventDefault;
		}
		return evt; // Event
	}

	this.stopEvent = function(/*Event*/evt){
		// summary:
		//		prevents propigation and clobbers the default action of the
		//		passed event
		// evt: Optional for IE. The native event object.
		if(window.event){
			evt.cancelBubble = true;
			evt.returnValue = false;
		}else{
			evt.preventDefault();
			evt.stopPropagation();
		}
	}
}

dojo.provide("dojo.event.*");

dojo.provide("dojo.string.common");

dojo.string.trim = function(/* string */str, /* integer? */wh){
	//	summary
	//	Trim whitespace from str.  If wh > 0, trim from start, if wh < 0, trim from end, else both
	if(!str.replace){ return str; }
	if(!str.length){ return str; }
	var re = (wh > 0) ? (/^\s+/) : (wh < 0) ? (/\s+$/) : (/^\s+|\s+$/g);
	return str.replace(re, "");	//	string
}

dojo.string.trimStart = function(/* string */str) {
	//	summary
	//	Trim whitespace at the beginning of 'str'
	return dojo.string.trim(str, 1);	//	string
}

dojo.string.trimEnd = function(/* string */str) {
	//	summary
	//	Trim whitespace at the end of 'str'
	return dojo.string.trim(str, -1);
}

dojo.string.repeat = function(/* string */str, /* integer */count, /* string? */separator) {
	//	summary
	//	Return 'str' repeated 'count' times, optionally placing 'separator' between each rep
	var out = "";
	for(var i = 0; i < count; i++) {
		out += str;
		if(separator && i < count - 1) {
			out += separator;
		}
	}
	return out;	//	string
}

dojo.string.pad = function(/* string */str, /* integer */len/*=2*/, /* string */ c/*='0'*/, /* integer */dir/*=1*/) {
	//	summary
	//	Pad 'str' to guarantee that it is at least 'len' length with the character 'c' at either the 
	//	start (dir=1) or end (dir=-1) of the string
	var out = String(str);
	if(!c) {
		c = '0';
	}
	if(!dir) {
		dir = 1;
	}
	while(out.length < len) {
		if(dir > 0) {
			out = c + out;
		} else {
			out += c;
		}
	}
	return out;	//	string
}

dojo.string.padLeft = function(/* string */str, /* integer */len, /* string */c) {
	//	summary
	//	same as dojo.string.pad(str, len, c, 1)
	return dojo.string.pad(str, len, c, 1);	//	string
}

dojo.string.padRight = function(/* string */str, /* integer */len, /* string */c) {
	//	summary
	//	same as dojo.string.pad(str, len, c, -1)
	return dojo.string.pad(str, len, c, -1);	//	string
}

dojo.provide("dojo.string");

dojo.provide("dojo.string.extras");


//TODO: should we use ${} substitution syntax instead, like widgets do?
dojo.string.substituteParams = function(/*string*/template, /* object - optional or ... */hash){
// summary:
//	Performs parameterized substitutions on a string. Throws an exception if any parameter is unmatched.
//
// description:
//	For example,
//		dojo.string.substituteParams("File '%{0}' is not found in directory '%{1}'.","foo.html","/temp");
//	returns
//		"File 'foo.html' is not found in directory '/temp'."
//
// template: the original string template with %{values} to be replaced
// hash: name/value pairs (type object) to provide substitutions.  Alternatively, substitutions may be
//	included as arguments 1..n to this function, corresponding to template parameters 0..n-1

	var map = (typeof hash == 'object') ? hash : dojo.lang.toArray(arguments, 1);

	return template.replace(/\%\{(\w+)\}/g, function(match, key){
		if(typeof(map[key]) != "undefined" && map[key] != null){
			return map[key];
		}
		dojo.raise("Substitution not found: " + key);
	}); // string
};

dojo.string.capitalize = function(/*string*/str){
// summary:
//	Uppercases the first letter of each word

	if(!dojo.lang.isString(str)){ return ""; }
	if(arguments.length == 0){ str = this; }

	var words = str.split(' ');
	for(var i=0; i<words.length; i++){
		words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
	}
	return words.join(" "); // string
}

dojo.string.isBlank = function(/*string*/str){
// summary:
//	Return true if the entire string is whitespace characters

	if(!dojo.lang.isString(str)){ return true; }
	return (dojo.string.trim(str).length == 0); // boolean
}

//FIXME: not sure exactly what encodeAscii is trying to do, or if it's working right
dojo.string.encodeAscii = function(/*string*/str){
	if(!dojo.lang.isString(str)){ return str; } // unknown
	var ret = "";
	var value = escape(str);
	var match, re = /%u([0-9A-F]{4})/i;
	while((match = value.match(re))){
		var num = Number("0x"+match[1]);
		var newVal = escape("&#" + num + ";");
		ret += value.substring(0, match.index) + newVal;
		value = value.substring(match.index+match[0].length);
	}
	ret += value.replace(/\+/g, "%2B");
	return ret; // string
}

dojo.string.escape = function(/*string*/type, /*string*/str){
// summary:
//	Adds escape sequences for special characters according to the convention of 'type'
//
// type: one of xml|html|xhtml|sql|regexp|regex|javascript|jscript|js|ascii
// str: the string to be escaped

	var args = dojo.lang.toArray(arguments, 1);
	switch(type.toLowerCase()){
		case "xml":
		case "html":
		case "xhtml":
			return dojo.string.escapeXml.apply(this, args); // string
		case "sql":
			return dojo.string.escapeSql.apply(this, args); // string
		case "regexp":
		case "regex":
			return dojo.string.escapeRegExp.apply(this, args); // string
		case "javascript":
		case "jscript":
		case "js":
			return dojo.string.escapeJavaScript.apply(this, args); // string
		case "ascii":
			// so it's encode, but it seems useful
			return dojo.string.encodeAscii.apply(this, args); // string
		default:
			return str; // string
	}
}

dojo.string.escapeXml = function(/*string*/str, /*boolean*/noSingleQuotes){
//summary:
//	Adds escape sequences for special characters in XML: &<>"'
//  Optionally skips escapes for single quotes

	str = str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;")
		.replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
	if(!noSingleQuotes){ str = str.replace(/'/gm, "&#39;"); }
	return str; // string
}

dojo.string.escapeSql = function(/*string*/str){
//summary:
//	Adds escape sequences for single quotes in SQL expressions

	return str.replace(/'/gm, "''"); //string
}

dojo.string.escapeRegExp = function(/*string*/str){
//summary:
//	Adds escape sequences for special characters in regular expressions

	return str.replace(/\\/gm, "\\\\").replace(/([\f\b\n\t\r[\^$|?*+(){}])/gm, "\\$1"); // string
}

//FIXME: should this one also escape backslash?
dojo.string.escapeJavaScript = function(/*string*/str){
//summary:
//	Adds escape sequences for single and double quotes as well
//	as non-visible characters in JavaScript string literal expressions

	return str.replace(/(["'\f\b\n\t\r])/gm, "\\$1"); // string
}

//FIXME: looks a lot like escapeJavaScript, just adds quotes? deprecate one?
dojo.string.escapeString = function(/*string*/str){
//summary:
//	Adds escape sequences for non-visual characters, double quote and backslash
//	and surrounds with double quotes to form a valid string literal.
	return ('"' + str.replace(/(["\\])/g, '\\$1') + '"'
		).replace(/[\f]/g, "\\f"
		).replace(/[\b]/g, "\\b"
		).replace(/[\n]/g, "\\n"
		).replace(/[\t]/g, "\\t"
		).replace(/[\r]/g, "\\r"); // string
}

// TODO: make an HTML version
dojo.string.summary = function(/*string*/str, /*number*/len){
// summary:
//	Truncates 'str' after 'len' characters and appends periods as necessary so that it ends with "..."

	if(!len || str.length <= len){
		return str; // string
	}

	return str.substring(0, len).replace(/\.+$/, "") + "..."; // string
}

dojo.string.endsWith = function(/*string*/str, /*string*/end, /*boolean*/ignoreCase){
// summary:
//	Returns true if 'str' ends with 'end'

	if(ignoreCase){
		str = str.toLowerCase();
		end = end.toLowerCase();
	}
	if((str.length - end.length) < 0){
		return false; // boolean
	}
	return str.lastIndexOf(end) == str.length - end.length; // boolean
}

dojo.string.endsWithAny = function(/*string*/str /* , ... */){
// summary:
//	Returns true if 'str' ends with any of the arguments[2 -> n]

	for(var i = 1; i < arguments.length; i++) {
		if(dojo.string.endsWith(str, arguments[i])) {
			return true; // boolean
		}
	}
	return false; // boolean
}

dojo.string.startsWith = function(/*string*/str, /*string*/start, /*boolean*/ignoreCase){
// summary:
//	Returns true if 'str' starts with 'start'

	if(ignoreCase) {
		str = str.toLowerCase();
		start = start.toLowerCase();
	}
	return str.indexOf(start) == 0; // boolean
}

dojo.string.startsWithAny = function(/*string*/str /* , ... */){
// summary:
//	Returns true if 'str' starts with any of the arguments[2 -> n]

	for(var i = 1; i < arguments.length; i++) {
		if(dojo.string.startsWith(str, arguments[i])) {
			return true; // boolean
		}
	}
	return false; // boolean
}

dojo.string.has = function(/*string*/str /* , ... */) {
// summary:
//	Returns true if 'str' contains any of the arguments 2 -> n

	for(var i = 1; i < arguments.length; i++) {
		if(str.indexOf(arguments[i]) > -1){
			return true; // boolean
		}
	}
	return false; // boolean
}

dojo.string.normalizeNewlines = function(/*string*/text, /*string? (\n or \r)*/newlineChar){
// summary:
//	Changes occurences of CR and LF in text to CRLF, or if newlineChar is provided as '\n' or '\r',
//	substitutes newlineChar for occurrences of CR/LF and CRLF

	if (newlineChar == "\n"){
		text = text.replace(/\r\n/g, "\n");
		text = text.replace(/\r/g, "\n");
	} else if (newlineChar == "\r"){
		text = text.replace(/\r\n/g, "\r");
		text = text.replace(/\n/g, "\r");
	}else{
		text = text.replace(/([^\r])\n/g, "$1\r\n").replace(/\r([^\n])/g, "\r\n$1");
	}
	return text; // string
}

dojo.string.splitEscaped = function(/*string*/str, /*string of length=1*/charac){
// summary:
//	Splits 'str' into an array separated by 'charac', but skips characters escaped with a backslash

	var components = [];
	for (var i = 0, prevcomma = 0; i < str.length; i++){
		if (str.charAt(i) == '\\'){ i++; continue; }
		if (str.charAt(i) == charac){
			components.push(str.substring(prevcomma, i));
			prevcomma = i + 1;
		}
	}
	components.push(str.substr(prevcomma));
	return components; // array
}

dojo.provide("dojo.string.Builder");

// NOTE: testing shows that direct "+=" concatenation is *much* faster on
// Spidermoneky and Rhino, while arr.push()/arr.join() style concatenation is
// significantly quicker on IE (Jscript/wsh/etc.).

dojo.string.Builder = function(/* string? */str){
	//	summary
	this.arrConcat = (dojo.render.html.capable && dojo.render.html["ie"]);

	var a = [];
	var b = "";
	var length = this.length = b.length;

	if(this.arrConcat){
		if(b.length > 0){
			a.push(b);
		}
		b = "";
	}

	this.toString = this.valueOf = function(){ 
		//	summary
		//	Concatenate internal buffer and return as a string
		return (this.arrConcat) ? a.join("") : b;	//	string
	};

	this.append = function(){
		//	summary
		//	Append all arguments to the end of the internal buffer
		for(var x=0; x<arguments.length; x++){
			var s = arguments[x];
			if(dojo.lang.isArrayLike(s)){
				this.append.apply(this, s);
			} else {
				if(this.arrConcat){
					a.push(s);
				}else{
					b+=s;
				}
				length += s.length;
				this.length = length;
			}
		}
		return this;	//	dojo.string.Builder
	};

	this.clear = function(){
		//	summary
		//	Clear the internal buffer.
		a = [];
		b = "";
		length = this.length = 0;
		return this;	//	dojo.string.Builder
	};

	this.remove = function(/* integer */f, /* integer */l){
		//	summary
		//	Remove a section of string from the internal buffer.
		var s = ""; 
		if(this.arrConcat){
			b = a.join(""); 
		}
		a=[];
		if(f>0){
			s = b.substring(0, (f-1));
		}
		b = s + b.substring(f + l); 
		length = this.length = b.length; 
		if(this.arrConcat){
			a.push(b);
			b="";
		}
		return this;	//	dojo.string.Builder
	};

	this.replace = function(/* string */o, /* string */n){
		//	summary
		//	replace phrase *o* with phrase *n*.
		if(this.arrConcat){
			b = a.join(""); 
		}
		a = []; 
		b = b.replace(o,n); 
		length = this.length = b.length; 
		if(this.arrConcat){
			a.push(b);
			b="";
		}
		return this;	//	dojo.string.Builder
	};

	this.insert = function(/* integer */idx, /* string */s){
		//	summary
		//	Insert string s at index idx.
		if(this.arrConcat){
			b = a.join(""); 
		}
		a=[];
		if(idx == 0){
			b = s + b;
		}else{
			var t = b.split("");
			t.splice(idx,0,s);
			b = t.join("")
		}
		length = this.length = b.length; 
		if(this.arrConcat){
			a.push(b); 
			b="";
		}
		return this;	//	dojo.string.Builder
	};

	this.append.apply(this, arguments);
};

dojo.provide("dojo.string.*");

dojo.provide("dojo.uri.Uri");

dojo.uri = new function() {
	this.dojoUri = function (/*dojo.uri.Uri||String*/uri) {
		// summary: returns a Uri object resolved relative to the dojo root
		return new dojo.uri.Uri(dojo.hostenv.getBaseScriptUri(), uri);
	}

	this.moduleUri = function(/*String*/module, /*dojo.uri.Uri||String*/uri){
		// summary: returns a Uri object relative to a module
		// description: Examples: dojo.uri.moduleUri("dojo","Editor"), or dojo.uri.moduleUri("acme","someWidget")
		var loc = dojo.hostenv.getModuleSymbols(module).join('/');
		//var loc = dojo.hostenv.getModulePrefix(module);
		if(!loc){return null;}
		if(loc.lastIndexOf("/") != loc.length-1){loc += "/";}
		return new dojo.uri.Uri(dojo.hostenv.getBaseScriptUri()+loc,uri);
	}

	this.Uri = function (/*dojo.uri.Uri||String...*/) {
		// summary: Constructor to create an object representing a URI.
		// description: 
		//  Each argument is evaluated in order relative to the next until
		//  a canonical uri is produced. To get an absolute Uri relative
		//  to the current document use
		//      new dojo.uri.Uri(document.baseURI, uri)

		// TODO: support for IPv6, see RFC 2732

		// resolve uri components relative to each other
		var uri = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			if(!arguments[i]) { continue; }

			// Safari doesn't support this.constructor so we have to be explicit
			var relobj = new dojo.uri.Uri(arguments[i].toString());
			var uriobj = new dojo.uri.Uri(uri.toString());

			if ((relobj.path=="")&&(relobj.scheme==null)&&(relobj.authority==null)&&(relobj.query==null)) {
				if (relobj.fragment != null) { uriobj.fragment = relobj.fragment; }
				relobj = uriobj;
			} else if (relobj.scheme == null) {
				relobj.scheme = uriobj.scheme;

				if (relobj.authority == null) {
					relobj.authority = uriobj.authority;

					if (relobj.path.charAt(0) != "/") {
						var path = uriobj.path.substring(0,
							uriobj.path.lastIndexOf("/") + 1) + relobj.path;

						var segs = path.split("/");
						for (var j = 0; j < segs.length; j++) {
							if (segs[j] == ".") {
								if (j == segs.length - 1) { segs[j] = ""; }
								else { segs.splice(j, 1); j--; }
							} else if (j > 0 && !(j == 1 && segs[0] == "") &&
								segs[j] == ".." && segs[j-1] != "..") {

								if (j == segs.length - 1) { segs.splice(j, 1); segs[j - 1] = ""; }
								else { segs.splice(j - 1, 2); j -= 2; }
							}
						}
						relobj.path = segs.join("/");
					}
				}
			}

			uri = "";
			if (relobj.scheme != null) { uri += relobj.scheme + ":"; }
			if (relobj.authority != null) { uri += "//" + relobj.authority; }
			uri += relobj.path;
			if (relobj.query != null) { uri += "?" + relobj.query; }
			if (relobj.fragment != null) { uri += "#" + relobj.fragment; }
		}

		this.uri = uri.toString();

		// break the uri into its main components
		var regexp = "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
		var r = this.uri.match(new RegExp(regexp));

		this.scheme = r[2] || (r[1] ? "" : null);
		this.authority = r[4] || (r[3] ? "" : null);
		this.path = r[5]; // can never be undefined
		this.query = r[7] || (r[6] ? "" : null);
		this.fragment  = r[9] || (r[8] ? "" : null);

		if (this.authority != null) {
			// server based naming authority
			regexp = "^((([^:]+:)?([^@]+))@)?([^:]*)(:([0-9]+))?$";
			r = this.authority.match(new RegExp(regexp));

			this.user = r[3] || null;
			this.password = r[4] || null;
			this.host = r[5];
			this.port = r[7] || null;
		}

		this.toString = function(){ return this.uri; }
	}
};

dojo.provide("dojo.uri.*");

dojo.provide("dojo.dom");

dojo.dom.ELEMENT_NODE                  = 1;
dojo.dom.ATTRIBUTE_NODE                = 2;
dojo.dom.TEXT_NODE                     = 3;
dojo.dom.CDATA_SECTION_NODE            = 4;
dojo.dom.ENTITY_REFERENCE_NODE         = 5;
dojo.dom.ENTITY_NODE                   = 6;
dojo.dom.PROCESSING_INSTRUCTION_NODE   = 7;
dojo.dom.COMMENT_NODE                  = 8;
dojo.dom.DOCUMENT_NODE                 = 9;
dojo.dom.DOCUMENT_TYPE_NODE            = 10;
dojo.dom.DOCUMENT_FRAGMENT_NODE        = 11;
dojo.dom.NOTATION_NODE                 = 12;
	
dojo.dom.dojoml = "http://www.dojotoolkit.org/2004/dojoml";

/**
 *	comprehensive list of XML namespaces
**/
dojo.dom.xmlns = {
	//	summary
	//	aliases for various common XML namespaces
	svg : "http://www.w3.org/2000/svg",
	smil : "http://www.w3.org/2001/SMIL20/",
	mml : "http://www.w3.org/1998/Math/MathML",
	cml : "http://www.xml-cml.org",
	xlink : "http://www.w3.org/1999/xlink",
	xhtml : "http://www.w3.org/1999/xhtml",
	xul : "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
	xbl : "http://www.mozilla.org/xbl",
	fo : "http://www.w3.org/1999/XSL/Format",
	xsl : "http://www.w3.org/1999/XSL/Transform",
	xslt : "http://www.w3.org/1999/XSL/Transform",
	xi : "http://www.w3.org/2001/XInclude",
	xforms : "http://www.w3.org/2002/01/xforms",
	saxon : "http://icl.com/saxon",
	xalan : "http://xml.apache.org/xslt",
	xsd : "http://www.w3.org/2001/XMLSchema",
	dt: "http://www.w3.org/2001/XMLSchema-datatypes",
	xsi : "http://www.w3.org/2001/XMLSchema-instance",
	rdf : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
	rdfs : "http://www.w3.org/2000/01/rdf-schema#",
	dc : "http://purl.org/dc/elements/1.1/",
	dcq: "http://purl.org/dc/qualifiers/1.0",
	"soap-env" : "http://schemas.xmlsoap.org/soap/envelope/",
	wsdl : "http://schemas.xmlsoap.org/wsdl/",
	AdobeExtensions : "http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
};

dojo.dom.isNode = function(/* object */wh){
	//	summary:
	//		checks to see if wh is actually a node.
	if(typeof Element == "function") {
		try {
			return wh instanceof Element;	//	boolean
		} catch(e) {}
	} else {
		// best-guess
		return wh && !isNaN(wh.nodeType);	//	boolean
	}
}

dojo.dom.getUniqueId = function(){
	//	summary:
	//		returns a unique string for use with any DOM element
	var _document = dojo.doc();
	do {
		var id = "dj_unique_" + (++arguments.callee._idIncrement);
	}while(_document.getElementById(id));
	return id;	//	string
}
dojo.dom.getUniqueId._idIncrement = 0;

dojo.dom.firstElement = dojo.dom.getFirstChildElement = function(/* Element */parentNode, /* string? */tagName){
	//	summary:
	//		returns the first child element matching tagName
	var node = parentNode.firstChild;
	while(node && node.nodeType != dojo.dom.ELEMENT_NODE){
		node = node.nextSibling;
	}
	if(tagName && node && node.tagName && node.tagName.toLowerCase() != tagName.toLowerCase()) {
		node = dojo.dom.nextElement(node, tagName);
	}
	return node;	//	Element
}

dojo.dom.lastElement = dojo.dom.getLastChildElement = function(/* Element */parentNode, /* string? */tagName){
	//	summary:
	//		returns the last child element matching tagName
	var node = parentNode.lastChild;
	while(node && node.nodeType != dojo.dom.ELEMENT_NODE) {
		node = node.previousSibling;
	}
	if(tagName && node && node.tagName && node.tagName.toLowerCase() != tagName.toLowerCase()) {
		node = dojo.dom.prevElement(node, tagName);
	}
	return node;	//	Element
}

dojo.dom.nextElement = dojo.dom.getNextSiblingElement = function(/* Node */node, /* string? */tagName){
	//	summary:
	//		returns the next sibling element matching tagName
	if(!node) { return null; }
	do {
		node = node.nextSibling;
	} while(node && node.nodeType != dojo.dom.ELEMENT_NODE);

	if(node && tagName && tagName.toLowerCase() != node.tagName.toLowerCase()) {
		return dojo.dom.nextElement(node, tagName);
	}
	return node;	//	Element
}

dojo.dom.prevElement = dojo.dom.getPreviousSiblingElement = function(/* Node */node, /* string? */tagName){
	//	summary:
	//		returns the previous sibling element matching tagName
	if(!node) { return null; }
	if(tagName) { tagName = tagName.toLowerCase(); }
	do {
		node = node.previousSibling;
	} while(node && node.nodeType != dojo.dom.ELEMENT_NODE);

	if(node && tagName && tagName.toLowerCase() != node.tagName.toLowerCase()) {
		return dojo.dom.prevElement(node, tagName);
	}
	return node;	//	Element
}

// TODO: hmph
/*this.forEachChildTag = function(node, unaryFunc) {
	var child = this.getFirstChildTag(node);
	while(child) {
		if(unaryFunc(child) == "break") { break; }
		child = this.getNextSiblingTag(child);
	}
}*/

dojo.dom.moveChildren = function(/*Element*/srcNode, /*Element*/destNode, /*boolean?*/trim){
	//	summary:
	//		Moves children from srcNode to destNode and returns the count of
	//		children moved; will trim off text nodes if trim == true
	var count = 0;
	if(trim) {
		while(srcNode.hasChildNodes() &&
			srcNode.firstChild.nodeType == dojo.dom.TEXT_NODE) {
			srcNode.removeChild(srcNode.firstChild);
		}
		while(srcNode.hasChildNodes() &&
			srcNode.lastChild.nodeType == dojo.dom.TEXT_NODE) {
			srcNode.removeChild(srcNode.lastChild);
		}
	}
	while(srcNode.hasChildNodes()){
		destNode.appendChild(srcNode.firstChild);
		count++;
	}
	return count;	//	number
}

dojo.dom.copyChildren = function(/*Element*/srcNode, /*Element*/destNode, /*boolean?*/trim){
	//	summary:
	//		Copies children from srcNde to destNode and returns the count of
	//		children copied; will trim off text nodes if trim == true
	var clonedNode = srcNode.cloneNode(true);
	return this.moveChildren(clonedNode, destNode, trim);	//	number
}

dojo.dom.replaceChildren = function(/*Element*/node, /*Node*/newChild){
	//	summary:
	//		Removes all children of node and appends newChild. All the existing
	//		children will be destroyed.
	// FIXME: what if newChild is an array-like object?
	var nodes = [];
	if(dojo.render.html.ie){
		for(var i=0;i<node.childNodes.length;i++){
			nodes.push(node.childNodes[i]);
		}
	}
	dojo.dom.removeChildren(node);
	node.appendChild(newChild);
	for(var i=0;i<nodes.length;i++){
		dojo.dom.destroyNode(nodes[i]);
	}
}

dojo.dom.removeChildren = function(/*Element*/node){
	//	summary:
	//		removes all children from node and returns the count of children removed.
	//		The children nodes are not destroyed. Be sure to call destroyNode on them
	//		after they are not used anymore.
	var count = node.childNodes.length;
	while(node.hasChildNodes()){ dojo.dom.removeNode(node.firstChild); }
	return count; // int
}

dojo.dom.replaceNode = function(/*Element*/node, /*Element*/newNode){
	//	summary:
	//		replaces node with newNode and returns a reference to the removed node.
	//		To prevent IE memory leak, call destroyNode on the returned node when
	//		it is no longer needed.
	return node.parentNode.replaceChild(newNode, node); // Node
}

dojo.dom.destroyNode = function(/*Node*/node){
	// summary:
	//		destroy a node (it can not be used any more). For IE, this is the
	//		right function to call to prevent memory leaks. While for other
	//		browsers, this is identical to dojo.dom.removeNode
	if(node.parentNode){
		node = dojo.dom.removeNode(node);
	}
	if(node.nodeType != 3){ // ingore TEXT_NODE
		if(dojo.evalObjPath("dojo.event.browser.clean", false)){
			dojo.event.browser.clean(node);
		}
		if(dojo.render.html.ie){
			node.outerHTML=''; //prevent ugly IE mem leak associated with Node.removeChild (ticket #1727)
		}
	}
}

dojo.dom.removeNode = function(/*Node*/node){
	// summary:
	//		if node has a parent, removes node from parent and returns a
	//		reference to the removed child.
	//		To prevent IE memory leak, call destroyNode on the returned node when
	//		it is no longer needed.
	//	node:
	//		the node to remove from its parent.

	if(node && node.parentNode){
		// return a ref to the removed child
		return node.parentNode.removeChild(node); //Node
	}
}

dojo.dom.getAncestors = function(/*Node*/node, /*function?*/filterFunction, /*boolean?*/returnFirstHit){
	//	summary:
	//		returns all ancestors matching optional filterFunction; will return
	//		only the first if returnFirstHit
	var ancestors = [];
	var isFunction = (filterFunction && (filterFunction instanceof Function || typeof filterFunction == "function"));
	while(node){
		if(!isFunction || filterFunction(node)){
			ancestors.push(node);
		}
		if(returnFirstHit && ancestors.length > 0){ 
			return ancestors[0]; 	//	Node
		}
		
		node = node.parentNode;
	}
	if(returnFirstHit){ return null; }
	return ancestors;	//	array
}

dojo.dom.getAncestorsByTag = function(/*Node*/node, /*String*/tag, /*boolean?*/returnFirstHit){
	//	summary:
	//		returns all ancestors matching tag (as tagName), will only return
	//		first one if returnFirstHit
	tag = tag.toLowerCase();
	return dojo.dom.getAncestors(node, function(el){
		return ((el.tagName)&&(el.tagName.toLowerCase() == tag));
	}, returnFirstHit);	//	Node || array
}

dojo.dom.getFirstAncestorByTag = function(/*Node*/node, /*string*/tag){
	//	summary:
	//		Returns first ancestor of node with tag tagName
	return dojo.dom.getAncestorsByTag(node, tag, true);	//	Node
}

dojo.dom.isDescendantOf = function(/* Node */node, /* Node */ancestor, /* boolean? */guaranteeDescendant){
	//	summary
	//	Returns boolean if node is a descendant of ancestor
	// guaranteeDescendant allows us to be a "true" isDescendantOf function
	if(guaranteeDescendant && node) { node = node.parentNode; }
	while(node) {
		if(node == ancestor){ 
			return true; 	//	boolean
		}
		node = node.parentNode;
	}
	return false;	//	boolean
}

dojo.dom.innerXML = function(/*Node*/node){
	//	summary:
	//		Implementation of MS's innerXML function.
	if(node.innerXML){
		return node.innerXML;	//	string
	}else if (node.xml){
		return node.xml;		//	string
	}else if(typeof XMLSerializer != "undefined"){
		return (new XMLSerializer()).serializeToString(node);	//	string
	}
}

dojo.dom.createDocument = function(){
	//	summary:
	//		cross-browser implementation of creating an XML document object.
	var doc = null;
	var _document = dojo.doc();

	if(!dj_undef("ActiveXObject")){
		var prefixes = [ "MSXML2", "Microsoft", "MSXML", "MSXML3" ];
		for(var i = 0; i<prefixes.length; i++){
			try{
				doc = new ActiveXObject(prefixes[i]+".XMLDOM");
			}catch(e){ /* squelch */ };

			if(doc){ break; }
		}
	}else if((_document.implementation)&&
		(_document.implementation.createDocument)){
		doc = _document.implementation.createDocument("", "", null);
	}
	
	return doc;	//	DOMDocument
}

dojo.dom.createDocumentFromText = function(/*string*/str, /*string?*/mimetype){
	//	summary:
	//		attempts to create a Document object based on optional mime-type,
	//		using str as the contents of the document
	if(!mimetype){ mimetype = "text/xml"; }
	if(!dj_undef("DOMParser")){
		var parser = new DOMParser();
		return parser.parseFromString(str, mimetype);	//	DOMDocument
	}else if(!dj_undef("ActiveXObject")){
		var domDoc = dojo.dom.createDocument();
		if(domDoc){
			domDoc.async = false;
			domDoc.loadXML(str);
			return domDoc;	//	DOMDocument
		}else{
			dojo.debug("toXml didn't work?");
		}
	/*
	}else if((dojo.render.html.capable)&&(dojo.render.html.safari)){
		// FIXME: this doesn't appear to work!
		// from: http://web-graphics.com/mtarchive/001606.php
		// var xml = '<?xml version="1.0"?>'+str;
		var mtype = "text/xml";
		var xml = '<?xml version="1.0"?>'+str;
		var url = "data:"+mtype+";charset=utf-8,"+encodeURIComponent(xml);
		var req = new XMLHttpRequest();
		req.open("GET", url, false);
		req.overrideMimeType(mtype);
		req.send(null);
		return req.responseXML;
	*/
	}else{
		var _document = dojo.doc();
		if(_document.createElement){
			// FIXME: this may change all tags to uppercase!
			var tmp = _document.createElement("xml");
			tmp.innerHTML = str;
			if(_document.implementation && _document.implementation.createDocument){
				var xmlDoc = _document.implementation.createDocument("foo", "", null);
				for(var i = 0; i < tmp.childNodes.length; i++) {
					xmlDoc.importNode(tmp.childNodes.item(i), true);
				}
				return xmlDoc;	//	DOMDocument
			}
			// FIXME: probably not a good idea to have to return an HTML fragment
			// FIXME: the tmp.doc.firstChild is as tested from IE, so it may not
			// work that way across the board
			return ((tmp.document)&&
				(tmp.document.firstChild ?  tmp.document.firstChild : tmp));	//	DOMDocument
		}
	}
	return null;
}

dojo.dom.prependChild = function(/*Element*/node, /*Element*/parent){
	//	summary:
	//		prepends node to parent's children nodes
	if(parent.firstChild) {
		parent.insertBefore(node, parent.firstChild);
	} else {
		parent.appendChild(node);
	}
	return true;	//	boolean
}

dojo.dom.insertBefore = function(/*Node*/node, /*Node*/ref, /*boolean?*/force){
	//	summary:
	//		Try to insert node before ref
	if(	(force != true)&&
		(node === ref || node.nextSibling === ref)){ return false; }
	var parent = ref.parentNode;
	parent.insertBefore(node, ref);
	return true;	//	boolean
}

dojo.dom.insertAfter = function(/*Node*/node, /*Node*/ref, /*boolean?*/force){
	//	summary:
	//		Try to insert node after ref
	var pn = ref.parentNode;
	if(ref == pn.lastChild){
		if((force != true)&&(node === ref)){
			return false;	//	boolean
		}
		pn.appendChild(node);
	}else{
		return this.insertBefore(node, ref.nextSibling, force);	//	boolean
	}
	return true;	//	boolean
}

dojo.dom.insertAtPosition = function(/*Node*/node, /*Node*/ref, /*string*/position){
	//	summary:
	//		attempt to insert node in relation to ref based on position
	if((!node)||(!ref)||(!position)){ 
		return false;	//	boolean 
	}
	switch(position.toLowerCase()){
		case "before":
			return dojo.dom.insertBefore(node, ref);	//	boolean
		case "after":
			return dojo.dom.insertAfter(node, ref);		//	boolean
		case "first":
			if(ref.firstChild){
				return dojo.dom.insertBefore(node, ref.firstChild);	//	boolean
			}else{
				ref.appendChild(node);
				return true;	//	boolean
			}
			break;
		default: // aka: last
			ref.appendChild(node);
			return true;	//	boolean
	}
}

dojo.dom.insertAtIndex = function(/*Node*/node, /*Element*/containingNode, /*number*/insertionIndex){
	//	summary:
	//		insert node into child nodes nodelist of containingNode at
	//		insertionIndex. insertionIndex should be between 0 and 
	//		the number of the childNodes in containingNode. insertionIndex
	//		specifys after how many childNodes in containingNode the node
	//		shall be inserted. If 0 is given, node will be appended to 
	//		containingNode.
	var siblingNodes = containingNode.childNodes;

	// if there aren't any kids yet, just add it to the beginning

	if (!siblingNodes.length || siblingNodes.length == insertionIndex){
		containingNode.appendChild(node);
		return true;	//	boolean
	}

	if(insertionIndex == 0){
		return dojo.dom.prependChild(node, containingNode);	//	boolean
	}
	// otherwise we need to walk the childNodes
	// and find our spot

	return dojo.dom.insertAfter(node, siblingNodes[insertionIndex-1]);	//	boolean
}
	
dojo.dom.textContent = function(/*Node*/node, /*string*/text){
	//	summary:
	//		implementation of the DOM Level 3 attribute; scan node for text
	if (arguments.length>1) {
		var _document = dojo.doc();
		dojo.dom.replaceChildren(node, _document.createTextNode(text));
		return text;	//	string
	} else {
		if(node.textContent != undefined){ //FF 1.5
			return node.textContent;	//	string
		}
		var _result = "";
		if (node == null) { return _result; }
		for (var i = 0; i < node.childNodes.length; i++) {
			switch (node.childNodes[i].nodeType) {
				case 1: // ELEMENT_NODE
				case 5: // ENTITY_REFERENCE_NODE
					_result += dojo.dom.textContent(node.childNodes[i]);
					break;
				case 3: // TEXT_NODE
				case 2: // ATTRIBUTE_NODE
				case 4: // CDATA_SECTION_NODE
					_result += node.childNodes[i].nodeValue;
					break;
				default:
					break;
			}
		}
		return _result;	//	string
	}
}

dojo.dom.hasParent = function(/*Node*/node){
	//	summary:
	//		returns whether or not node is a child of another node.
	return Boolean(node && node.parentNode && dojo.dom.isNode(node.parentNode));	//	boolean
}

/**
 * Examples:
 *
 * myFooNode = <foo />
 * isTag(myFooNode, "foo"); // returns "foo"
 * isTag(myFooNode, "bar"); // returns ""
 * isTag(myFooNode, "FOO"); // returns ""
 * isTag(myFooNode, "hey", "foo", "bar"); // returns "foo"
**/
dojo.dom.isTag = function(/* Node */node /* ... */){
	//	summary:
	//		determines if node has any of the provided tag names and returns
	//		the tag name that matches, empty string otherwise.
	if(node && node.tagName) {
		for(var i=1; i<arguments.length; i++){
			if(node.tagName==String(arguments[i])){
				return String(arguments[i]);	//	string
			}
		}
	}
	return "";	//	string
}

dojo.dom.setAttributeNS = function(	/*Element*/elem, /*string*/namespaceURI, 
									/*string*/attrName, /*string*/attrValue){
	//	summary:
	//		implementation of DOM2 setAttributeNS that works cross browser.
	if(elem == null || ((elem == undefined)&&(typeof elem == "undefined"))){
		dojo.raise("No element given to dojo.dom.setAttributeNS");
	}
	
	if(!((elem.setAttributeNS == undefined)&&(typeof elem.setAttributeNS == "undefined"))){ // w3c
		elem.setAttributeNS(namespaceURI, attrName, attrValue);
	}else{ // IE
		// get a root XML document
		var ownerDoc = elem.ownerDocument;
		var attribute = ownerDoc.createNode(
			2, // node type
			attrName,
			namespaceURI
		);
		
		// set value
		attribute.nodeValue = attrValue;
		
		// attach to element
		elem.setAttributeNode(attribute);
	}
}

dojo.provide("dojo.html.common");

dojo.lang.mixin(dojo.html, dojo.dom);

dojo.html.body = function(){
	dojo.deprecated("dojo.html.body() moved to dojo.body()", "0.5");
	return dojo.body();
}

// FIXME: we are going to assume that we can throw any and every rendering
// engine into the IE 5.x box model. In Mozilla, we do this w/ CSS.
// Need to investigate for KHTML and Opera

dojo.html.getEventTarget = function(/* DOMEvent */evt){
	//	summary
	//	Returns the target of an event
	if(!evt) { evt = dojo.global().event || {} };
	var t = (evt.srcElement ? evt.srcElement : (evt.target ? evt.target : null));
	while((t)&&(t.nodeType!=1)){ t = t.parentNode; }
	return t;	//	HTMLElement
}

dojo.html.getViewport = function(){
	//	summary
	//	Returns the dimensions of the viewable area of a browser window
	var _window = dojo.global();
	var _document = dojo.doc();
	var w = 0;
	var h = 0;

	if(dojo.render.html.mozilla){
		// mozilla
		w = _document.documentElement.clientWidth;
		h = _window.innerHeight;
	}else if(!dojo.render.html.opera && _window.innerWidth){
		//in opera9, dojo.body().clientWidth should be used, instead
		//of window.innerWidth/document.documentElement.clientWidth
		//so we have to check whether it is opera
		w = _window.innerWidth;
		h = _window.innerHeight;
	} else if (!dojo.render.html.opera && dojo.exists(_document, "documentElement.clientWidth")){
		// IE6 Strict
		var w2 = _document.documentElement.clientWidth;
		// this lets us account for scrollbars
		if(!w || w2 && w2 < w) {
			w = w2;
		}
		h = _document.documentElement.clientHeight;
	} else if (dojo.body().clientWidth){
		// IE, Opera
		w = dojo.body().clientWidth;
		h = dojo.body().clientHeight;
	}
	return { width: w, height: h };	//	object
}

dojo.html.getScroll = function(){
	//	summary
	//	Returns the scroll position of the document
	var _window = dojo.global();
	var _document = dojo.doc();
	var top = _window.pageYOffset || _document.documentElement.scrollTop || dojo.body().scrollTop || 0;
	var left = _window.pageXOffset || _document.documentElement.scrollLeft || dojo.body().scrollLeft || 0;
	return { 
		top: top, 
		left: left, 
		offset:{ x: left, y: top }	//	note the change, NOT an Array with added properties. 
	};	//	object
}

dojo.html.getParentByType = function(/* HTMLElement */node, /* string */type) {
	//	summary
	//	Returns the first ancestor of node with tagName type.
	var _document = dojo.doc();
	var parent = dojo.byId(node);
	type = type.toLowerCase();
	while((parent)&&(parent.nodeName.toLowerCase()!=type)){
		if(parent==(_document["body"]||_document["documentElement"])){
			return null;
		}
		parent = parent.parentNode;
	}
	return parent;	//	HTMLElement
}

dojo.html.getAttribute = function(/* HTMLElement */node, /* string */attr){
	//	summary
	//	Returns the value of attribute attr from node.
	node = dojo.byId(node);
	// FIXME: need to add support for attr-specific accessors
	if((!node)||(!node.getAttribute)){
		// if(attr !== 'nwType'){
		//	alert("getAttr of '" + attr + "' with bad node"); 
		// }
		return null;
	}
	var ta = typeof attr == 'string' ? attr : new String(attr);

	// first try the approach most likely to succeed
	var v = node.getAttribute(ta.toUpperCase());
	if((v)&&(typeof v == 'string')&&(v!="")){ 
		return v;	//	string 
	}

	// try returning the attributes value, if we couldn't get it as a string
	if(v && v.value){ 
		return v.value;	//	string 
	}

	// this should work on Opera 7, but it's a little on the crashy side
	if((node.getAttributeNode)&&(node.getAttributeNode(ta))){
		return (node.getAttributeNode(ta)).value;	//	string
	}else if(node.getAttribute(ta)){
		return node.getAttribute(ta);	//	string
	}else if(node.getAttribute(ta.toLowerCase())){
		return node.getAttribute(ta.toLowerCase());	//	string
	}
	return null;	//	string
}
	
dojo.html.hasAttribute = function(/* HTMLElement */node, /* string */attr){
	//	summary
	//	Determines whether or not the specified node carries a value for the attribute in question.
	return dojo.html.getAttribute(dojo.byId(node), attr) ? true : false;	//	boolean
}
	
dojo.html.getCursorPosition = function(/* DOMEvent */e){
	//	summary
	//	Returns the mouse position relative to the document (not the viewport).
	//	For example, if you have a document that is 10000px tall,
	//	but your browser window is only 100px tall,
	//	if you scroll to the bottom of the document and call this function it
	//	will return {x: 0, y: 10000}
	//	NOTE: for events delivered via dojo.event.connect() and/or dojoAttachEvent (for widgets),
	//	you can just access evt.pageX and evt.pageY, rather than calling this function.
	e = e || dojo.global().event;
	var cursor = {x:0, y:0};
	if(e.pageX || e.pageY){
		cursor.x = e.pageX;
		cursor.y = e.pageY;
	}else{
		var de = dojo.doc().documentElement;
		var db = dojo.body();
		cursor.x = e.clientX + ((de||db)["scrollLeft"]) - ((de||db)["clientLeft"]);
		cursor.y = e.clientY + ((de||db)["scrollTop"]) - ((de||db)["clientTop"]);
	}
	return cursor;	//	object
}

dojo.html.isTag = function(/* HTMLElement */node) {
	//	summary
	//	Like dojo.dom.isTag, except case-insensitive
	node = dojo.byId(node);
	if(node && node.tagName) {
		for (var i=1; i<arguments.length; i++){
			if (node.tagName.toLowerCase()==String(arguments[i]).toLowerCase()){
				return String(arguments[i]).toLowerCase();	//	string
			}
		}
	}
	return "";	//	string
}

//define dojo.html.createExternalElement for IE to workaround the annoying activation "feature" in new IE
//details: http://msdn.microsoft.com/library/default.asp?url=/workshop/author/dhtml/overview/activating_activex.asp
if(dojo.render.html.ie && !dojo.render.html.ie70){
	//only define createExternalElement for IE in none https to avoid "mixed content" warning dialog
	if(window.location.href.substr(0,6).toLowerCase() != "https:"){
		(function(){
			// FIXME: this seems not to work correctly on IE 7!!

			//The trick is to define a function in a script.src property:
			// <script src="javascript:'function createExternalElement(){...}'"></script>,
			//which will be treated as an external javascript file in IE
			var xscript = dojo.doc().createElement('script');
			xscript.src = "javascript:'dojo.html.createExternalElement=function(doc, tag){ return doc.createElement(tag); }'";
			dojo.doc().getElementsByTagName("head")[0].appendChild(xscript);
		})();
	}
}else{
	//for other browsers, simply use document.createElement
	//is enough
	dojo.html.createExternalElement = function(/* HTMLDocument */doc, /* string */tag){
		//	summary
		//	Creates an element in the HTML document, here for ActiveX activation workaround.
		return doc.createElement(tag);	//	HTMLElement
	}
}

dojo.html._callDeprecated = function(inFunc, replFunc, args, argName, retValue){
	dojo.deprecated("dojo.html." + inFunc,
					"replaced by dojo.html." + replFunc + "(" + (argName ? "node, {"+ argName + ": " + argName + "}" : "" ) + ")" + (retValue ? "." + retValue : ""), "0.5");
	var newArgs = [];
	if(argName){ var argsIn = {}; argsIn[argName] = args[1]; newArgs.push(args[0]); newArgs.push(argsIn); }
	else { newArgs = args }
	var ret = dojo.html[replFunc].apply(dojo.html, args);
	if(retValue){ return ret[retValue]; }
	else { return ret; }
}

dojo.html.getViewportWidth = function(){
	return dojo.html._callDeprecated("getViewportWidth", "getViewport", arguments, null, "width");
}
dojo.html.getViewportHeight = function(){
	return dojo.html._callDeprecated("getViewportHeight", "getViewport", arguments, null, "height");
}
dojo.html.getViewportSize = function(){
	return dojo.html._callDeprecated("getViewportSize", "getViewport", arguments);
}
dojo.html.getScrollTop = function(){
	return dojo.html._callDeprecated("getScrollTop", "getScroll", arguments, null, "top");
}
dojo.html.getScrollLeft = function(){
	return dojo.html._callDeprecated("getScrollLeft", "getScroll", arguments, null, "left");
}
dojo.html.getScrollOffset = function(){
	return dojo.html._callDeprecated("getScrollOffset", "getScroll", arguments, null, "offset");
}

dojo.provide("dojo.flash");


dojo.flash = function(){
	// summary:
	//	The goal of dojo.flash is to make it easy to extend Flash's capabilities
	//	into an AJAX/DHTML environment.
	// description:  
	//	The goal of dojo.flash is to make it easy to extend Flash's capabilities
	//	into an AJAX/DHTML environment. Robust, performant, reliable 
	//	JavaScript/Flash communication is harder than most realize when they
	//	delve into the topic, especially if you want it
	//	to work on Internet Explorer, Firefox, and Safari, and to be able to
	//	push around hundreds of K of information quickly. Dojo.flash makes it
	//	possible to support these platforms; you have to jump through a few
	//	hoops to get its capabilites, but if you are a library writer 
	//	who wants to bring Flash's storage or streaming sockets ability into
	//	DHTML, for example, then dojo.flash is perfect for you.
	//  
	//	Dojo.flash provides an easy object for interacting with the Flash plugin. 
	//	This object provides methods to determine the current version of the Flash
	//	plugin (dojo.flash.info); execute Flash instance methods 
	//	independent of the Flash version
	//	being used (dojo.flash.comm); write out the necessary markup to 
	//	dynamically insert a Flash object into the page (dojo.flash.Embed; and 
	//	do dynamic installation and upgrading of the current Flash plugin in 
	//	use (dojo.flash.Install).
	//		
	//	To use dojo.flash, you must first wait until Flash is finished loading 
	//	and initializing before you attempt communication or interaction. 
	//	To know when Flash is finished use dojo.event.connect:
	//		
	//	dojo.event.connect(dojo.flash, "loaded", myInstance, "myCallback");
	//		
	//	Then, while the page is still loading provide the file name
	//	and the major version of Flash that will be used for Flash/JavaScript
	//	communication (see "Flash Communication" below for information on the 
	//	different kinds of Flash/JavaScript communication supported and how they 
	//	depend on the version of Flash installed):
	//		
	//	dojo.flash.setSwf({flash6: "src/storage/storage_flash6.swf",
	//										 flash8: "src/storage/storage_flash8.swf"});
	//		
	//	This will cause dojo.flash to pick the best way of communicating
	//	between Flash and JavaScript based on the platform.
	//		
	//	If no SWF files are specified, then Flash is not initialized.
	//		
	//	Your Flash must use DojoExternalInterface to expose Flash methods and
	//	to call JavaScript; see "Flash Communication" below for details.
	//		
	//	setSwf can take an optional 'visible' attribute to control whether
	//	the Flash object is visible or not on the page; the default is visible:
	//		
	//	dojo.flash.setSwf({flash6: "src/storage/storage_flash6.swf",
	//										 flash8: "src/storage/storage_flash8.swf",
	//										 visible: false});
	//		
	//	Once finished, you can query Flash version information:
	//		
	//	dojo.flash.info.version
	//		
	//	Or can communicate with Flash methods that were exposed:
	//		
	//	var results = dojo.flash.comm.sayHello("Some Message");
	//		
	//	Only string values are currently supported for both arguments and
	//	for return results. Everything will be cast to a string on both
	//	the JavaScript and Flash sides.
	//		
	//	-------------------
	//	Flash Communication
	//	-------------------
	//		
	//	dojo.flash allows Flash/JavaScript communication in 
	//	a way that can pass large amounts of data back and forth reliably and
	//	very fast. The dojo.flash
	//	framework encapsulates the specific way in which this communication occurs,
	//	presenting a common interface to JavaScript irrespective of the underlying
	//	Flash version.
	//		
	//	There are currently three major ways to do Flash/JavaScript communication
	//	in the Flash community:
	//		
	//	1) Flash 6+ - Uses Flash methods, such as SetVariable and TCallLabel,
	//	and the fscommand handler to do communication. Strengths: Very fast,
	//	mature, and can send extremely large amounts of data; can do
	//	synchronous method calls. Problems: Does not work on Safari; works on 
	//	Firefox/Mac OS X only if Flash 8 plugin is installed; cryptic to work with.
	//		
	//	2) Flash 8+ - Uses ExternalInterface, which provides a way for Flash
	//	methods to register themselves for callbacks from JavaScript, and a way
	//	for Flash to call JavaScript. Strengths: Works on Safari; elegant to
	//	work with; can do synchronous method calls. Problems: Extremely buggy 
	//	(fails if there are new lines in the data, for example); performance
	//	degrades drastically in O(n^2) time as data grows; locks up the browser while
	//	it is communicating; does not work in Internet Explorer if Flash
	//	object is dynamically added to page with document.writeln, DOM methods,
	//	or innerHTML.
	//		
	//	3) Flash 6+ - Uses two seperate Flash applets, one that we 
	//	create over and over, passing input data into it using the PARAM tag, 
	//	which then uses a Flash LocalConnection to pass the data to the main Flash
	//	applet; communication back to Flash is accomplished using a getURL
	//	call with a javascript protocol handler, such as "javascript:myMethod()".
	//	Strengths: the most cross browser, cross platform pre-Flash 8 method
	//	of Flash communication known; works on Safari. Problems: Timing issues;
	//	clunky and complicated; slow; can only send very small amounts of
	//	data (several K); all method calls are asynchronous.
	//		
	//	dojo.flash.comm uses only the first two methods. This framework
	//	was created primarily for dojo.storage, which needs to pass very large
	//	amounts of data synchronously and reliably across the Flash/JavaScript
	//	boundary. We use the first method, the Flash 6 method, on all platforms
	//	that support it, while using the Flash 8 ExternalInterface method
	//	only on Safari with some special code to help correct ExternalInterface's
	//	bugs.
	//		
	//	Since dojo.flash needs to have two versions of the Flash
	//	file it wants to generate, a Flash 6 and a Flash 8 version to gain
	//	true cross-browser compatibility, several tools are provided to ease
	//	development on the Flash side.
	//		
	//	In your Flash file, if you want to expose Flash methods that can be
	//	called, use the DojoExternalInterface class to register methods. This
	//	class is an exact API clone of the standard ExternalInterface class, but
	//	can work in Flash 6+ browsers. Under the covers it uses the best
	//	mechanism to do communication:
	//		
	//	class HelloWorld{
	//		function HelloWorld(){
	//			// Initialize the DojoExternalInterface class
	//			DojoExternalInterface.initialize();
	//			
	//			// Expose your methods
	//			DojoExternalInterface.addCallback("sayHello", this, this.sayHello);
	//				
	//			// Tell JavaScript that you are ready to have method calls
	//			DojoExternalInterface.loaded();
	//				
	//			// Call some JavaScript
	//			var resultsReady = function(results){
	//				trace("Received the following results from JavaScript: " + results);
	//			}
	//			DojoExternalInterface.call("someJavaScriptMethod", resultsReady, 
	//																	 someParameter);
	//		}
	//			
	//		function sayHello(){ ... }
	//			
	//		static main(){ ... }
	//	}
	//		
	//	DojoExternalInterface adds two new functions to the ExternalInterface
	//	API: initialize() and loaded(). initialize() must be called before
	//	any addCallback() or call() methods are run, and loaded() must be
	//	called after you are finished adding your callbacks. Calling loaded()
	//	will fire the dojo.flash.loaded() event, so that JavaScript can know that
	//	Flash has finished loading and adding its callbacks, and can begin to
	//	interact with the Flash file.
	//		
	//	To generate your SWF files, use the ant task
	//	"buildFlash". You must have the open source Motion Twin ActionScript 
	//	compiler (mtasc) installed and in your path to use the "buildFlash"
	//	ant task; download and install mtasc from http://www.mtasc.org/.
	//		
	//		
	//		
	//	buildFlash usage:
	//		
	//	ant buildFlash -Ddojo.flash.file=../tests/flash/HelloWorld.as
	//		
	//	where "dojo.flash.file" is the relative path to your Flash 
	//	ActionScript file.
	//		
	//	This will generate two SWF files, one ending in _flash6.swf and the other
	//	ending in _flash8.swf in the same directory as your ActionScript method:
	//		
	//	HelloWorld_flash6.swf
	//	HelloWorld_flash8.swf
	//		
	//	Initialize dojo.flash with the filename and Flash communication version to
	//	use during page load; see the documentation for dojo.flash for details:
	//		
	//	dojo.flash.setSwf({flash6: "tests/flash/HelloWorld_flash6.swf",
	//					 flash8: "tests/flash/HelloWorld_flash8.swf"});
	//		
	//	Now, your Flash methods can be called from JavaScript as if they are native
	//	Flash methods, mirrored exactly on the JavaScript side:
	//		
	//	dojo.flash.comm.sayHello();
	//		
	//	Only Strings are supported being passed back and forth currently.
	//		
	//	JavaScript to Flash communication is synchronous; i.e., results are returned
	//	directly from the method call:
	//		
	//	var results = dojo.flash.comm.sayHello();
	//		
	//	Flash to JavaScript communication is asynchronous due to limitations in
	//	the underlying technologies; you must use a results callback to handle
	//	results returned by JavaScript in your Flash AS files:
	//		
	//	var resultsReady = function(results){
	//		trace("Received the following results from JavaScript: " + results);
	//	}
	//	DojoExternalInterface.call("someJavaScriptMethod", resultsReady);
	//		
	//		
	//		
	//	-------------------
	//	Notes
	//	-------------------
	//		
	//	If you have both Flash 6 and Flash 8 versions of your file:
	//		
	//	dojo.flash.setSwf({flash6: "tests/flash/HelloWorld_flash6.swf",
	//					 flash8: "tests/flash/HelloWorld_flash8.swf"});
	//											 
	//	but want to force the browser to use a certain version of Flash for
	//	all platforms (for testing, for example), use the djConfig
	//	variable 'forceFlashComm' with the version number to force:
	//		
	//	var djConfig = { forceFlashComm: 6 };
	//		
	//	Two values are currently supported, 6 and 8, for the two styles of
	//	communication described above. Just because you force dojo.flash
	//	to use a particular communication style is no guarantee that it will
	//	work; for example, Flash 8 communication doesn't work in Internet
	//	Explorer due to bugs in Flash, and Flash 6 communication does not work
	//	in Safari. It is best to let dojo.flash determine the best communication
	//	mechanism, and to use the value above only for debugging the dojo.flash
	//	framework itself.
	//		
	//	Also note that dojo.flash can currently only work with one Flash object
	//	on the page; it and the API do not yet support multiple Flash objects on
	//	the same page.
	//		
	//	We use some special tricks to get decent, linear performance
	//	out of Flash 8's ExternalInterface on Safari; see the blog
	//	post 
	//	http://codinginparadise.org/weblog/2006/02/how-to-speed-up-flash-8s.html
	//	for details.
	//		
	//	Your code can detect whether the Flash player is installing or having
	//	its version revved in two ways. First, if dojo.flash detects that
	//	Flash installation needs to occur, it sets dojo.flash.info.installing
	//	to true. Second, you can detect if installation is necessary with the
	//	following callback:
	//		
	//	dojo.event.connect(dojo.flash, "installing", myInstance, "myCallback");
	//		
	//	You can use this callback to delay further actions that might need Flash;
	//	when installation is finished the full page will be refreshed and the
	//	user will be placed back on your page with Flash installed.
	//		
	//	Two utility methods exist if you want to add loading and installing
	//	listeners without creating dependencies on dojo.event; these are
	//	'addLoadingListener' and 'addInstallingListener'.
	//		
	//	-------------------
	//	Todo/Known Issues
	//	-------------------
	//
	//	There are several tasks I was not able to do, or did not need to fix
	//	to get dojo.storage out:		
	//		
	//	* When using Flash 8 communication, Flash method calls to JavaScript
	//	are not working properly; serialization might also be broken for certain
	//	invalid characters when it is Flash invoking JavaScript methods.
	//	The Flash side needs to have more sophisticated serialization/
	//	deserialization mechanisms like JavaScript currently has. The
	//	test_flash2.html unit tests should also be updated to have much more
	//	sophisticated Flash to JavaScript unit tests, including large
	//	amounts of data.
	//		
	//	* On Internet Explorer, after doing a basic install, the page is
	//	not refreshed or does not detect that Flash is now available. The way
	//	to fix this is to create a custom small Flash file that is pointed to
	//	during installation; when it is finished loading, it does a callback
	//	that says that Flash installation is complete on IE, and we can proceed
	//	to initialize the dojo.flash subsystem.
	//		
	//	Author- Brad Neuberg, bkn3@columbia.edu
}

dojo.flash = {
	flash6_version: null,
	flash8_version: null,
	ready: false,
	_visible: true,
	_loadedListeners: new Array(),
	_installingListeners: new Array(),
	
	setSwf: function(/* Object */ fileInfo){
		// summary: Sets the SWF files and versions we are using.
		// fileInfo: Object
		//	An object that contains two attributes, 'flash6' and 'flash8',
		//	each of which contains the path to our Flash 6 and Flash 8 versions
		//	of the file we want to script.
		//
		//	Example-
		//		var swfloc6 = dojo.uri.dojoUri("Storage_version6.swf").toString();
		//		var swfloc8 = dojo.uri.dojoUri("Storage_version8.swf").toString();
		//		dojo.flash.setSwf({flash6: swfloc6, flash8: swfloc8, visible: false}); 	
		
		if(fileInfo == null || dojo.lang.isUndefined(fileInfo)){
			return;
		}
		
		if(fileInfo.flash6 != null && !dojo.lang.isUndefined(fileInfo.flash6)){
			this.flash6_version = fileInfo.flash6;
		}
		
		if(fileInfo.flash8 != null && !dojo.lang.isUndefined(fileInfo.flash8)){
			this.flash8_version = fileInfo.flash8;
		}
		
		if(!dojo.lang.isUndefined(fileInfo.visible)){
			this._visible = fileInfo.visible;
		}
		
		// initialize ourselves		
		this._initialize();
	},
	
	useFlash6: function(){ /* Boolean */
		// summary: Returns whether we are using Flash 6 for communication on this platform.
		
		if(this.flash6_version == null){
			return false;
		}else if (this.flash6_version != null && dojo.flash.info.commVersion == 6){
			// if we have a flash 6 version of this SWF, and this browser supports 
			// communicating using Flash 6 features...
			return true;
		}else{
			return false;
		}
	},
	
	useFlash8: function(){ /* Boolean */
		// summary: Returns whether we are using Flash 8 for communication on this platform.
		
		if(this.flash8_version == null){
			return false;
		}else if (this.flash8_version != null && dojo.flash.info.commVersion == 8){
			// if we have a flash 8 version of this SWF, and this browser supports
			// communicating using Flash 8 features...
			return true;
		}else{
			return false;
		}
	},
	
	addLoadedListener: function(/* Function */ listener){
		// summary:
		//	Adds a listener to know when Flash is finished loading. 
		//	Useful if you don't want a dependency on dojo.event.
		// listener: Function
		//	A function that will be called when Flash is done loading.
		
		this._loadedListeners.push(listener);
	},

	addInstallingListener: function(/* Function */ listener){
		// summary:
		//	Adds a listener to know if Flash is being installed. 
		//	Useful if you don't want a dependency on dojo.event.
		// listener: Function
		//	A function that will be called if Flash is being
		//	installed
		
		this._installingListeners.push(listener);
	},	
	
	loaded: function(){
		// summary: Called back when the Flash subsystem is finished loading.
		// description:
		//	A callback when the Flash subsystem is finished loading and can be
		//	worked with. To be notified when Flash is finished loading, connect
		//	your callback to this method using the following:
		//	
		//	dojo.event.connect(dojo.flash, "loaded", myInstance, "myCallback");
		
		//dojo.debug("dojo.flash.loaded");
		dojo.flash.ready = true;
		if(dojo.flash._loadedListeners.length > 0){
			for(var i = 0;i < dojo.flash._loadedListeners.length; i++){
				dojo.flash._loadedListeners[i].call(null);
			}
		}
	},
	
	installing: function(){
		// summary: Called if Flash is being installed.
		// description:
		//	A callback to know if Flash is currently being installed or
		//	having its version revved. To be notified if Flash is installing, connect
		//	your callback to this method using the following:
		//	
		//	dojo.event.connect(dojo.flash, "installing", myInstance, "myCallback");
		 
		//dojo.debug("installing");
		if(dojo.flash._installingListeners.length > 0){
			for(var i = 0; i < dojo.flash._installingListeners.length; i++){
				dojo.flash._installingListeners[i].call(null);
			}
		}
	},
	
	// Initializes dojo.flash.
	_initialize: function(){
		//dojo.debug("dojo.flash._initialize");
		// see if we need to rev or install Flash on this platform
		var installer = new dojo.flash.Install();
		dojo.flash.installer = installer;

		if(installer.needed() == true){		
			installer.install();
		}else{
			//dojo.debug("Writing object out");
			// write the flash object into the page
			dojo.flash.obj = new dojo.flash.Embed(this._visible);
			dojo.flash.obj.write(dojo.flash.info.commVersion);
			
			// initialize the way we do Flash/JavaScript communication
			dojo.flash.comm = new dojo.flash.Communicator();
		}
	}
};


dojo.flash.Info = function(){
	// summary: A class that helps us determine whether Flash is available.
	// description:
	//	A class that helps us determine whether Flash is available,
	//	it's major and minor versions, and what Flash version features should
	//	be used for Flash/JavaScript communication. Parts of this code
	//	are adapted from the automatic Flash plugin detection code autogenerated 
	//	by the Macromedia Flash 8 authoring environment. 
	//	
	//	An instance of this class can be accessed on dojo.flash.info after
	//	the page is finished loading.
	//	
	//	This constructor must be called before the page is finished loading.	
	
	// Visual basic helper required to detect Flash Player ActiveX control 
	// version information on Internet Explorer
	if(dojo.render.html.ie){
		document.writeln('<script language="VBScript" type="text/vbscript"\>');
		document.writeln('Function VBGetSwfVer(i)');
		document.writeln('  on error resume next');
		document.writeln('  Dim swControl, swVersion');
		document.writeln('  swVersion = 0');
		document.writeln('  set swControl = CreateObject("ShockwaveFlash.ShockwaveFlash." + CStr(i))');
		document.writeln('  if (IsObject(swControl)) then');
		document.writeln('    swVersion = swControl.GetVariable("$version")');
		document.writeln('  end if');
		document.writeln('  VBGetSwfVer = swVersion');
		document.writeln('End Function');
		document.writeln('</script\>');
	}
	
	this._detectVersion();
	this._detectCommunicationVersion();
}

dojo.flash.Info.prototype = {
	// version: String
	//		The full version string, such as "8r22".
	version: -1,
	
	// versionMajor, versionMinor, versionRevision: String
	//		The major, minor, and revisions of the plugin. For example, if the
	//		plugin is 8r22, then the major version is 8, the minor version is 0,
	//		and the revision is 22. 
	versionMajor: -1,
	versionMinor: -1,
	versionRevision: -1,
	
	// capable: Boolean
	//		Whether this platform has Flash already installed.
	capable: false,
	
	// commVersion: int
	//		The major version number for how our Flash and JavaScript communicate.
	//		This can currently be the following values:
	//		6 - We use a combination of the Flash plugin methods, such as SetVariable
	//		and TCallLabel, along with fscommands, to do communication.
	//		8 - We use the ExternalInterface API. 
	//		-1 - For some reason neither method is supported, and no communication
	//		is possible. 
	commVersion: 6,
	
	// installing: Boolean
	//	Set if we are in the middle of a Flash installation session.
	installing: false,
	
	isVersionOrAbove: function(
							/* int */ reqMajorVer, 
							/* int */ reqMinorVer, 
							/* int */ reqVer){ /* Boolean */
		// summary: 
		//	Asserts that this environment has the given major, minor, and revision
		//	numbers for the Flash player.
		// description:
		//	Asserts that this environment has the given major, minor, and revision
		//	numbers for the Flash player. 
		//	
		//	Example- To test for Flash Player 7r14:
		//	
		//	dojo.flash.info.isVersionOrAbove(7, 0, 14)
		// returns:
		//	Returns true if the player is equal
		//	or above the given version, false otherwise.
		
		// make the revision a decimal (i.e. transform revision 14 into
		// 0.14
		reqVer = parseFloat("." + reqVer);
		
		if(this.versionMajor >= reqMajorVer && this.versionMinor >= reqMinorVer
			 && this.versionRevision >= reqVer){
			return true;
		}else{
			return false;
		}
	},
	
	_detectVersion: function(){
		var versionStr;
		
		// loop backwards through the versions until we find the newest version	
		for(var testVersion = 25; testVersion > 0; testVersion--){
			if(dojo.render.html.ie){
				versionStr = VBGetSwfVer(testVersion);
			}else{
				versionStr = this._JSFlashInfo(testVersion);		
			}
				
			if(versionStr == -1 ){
				this.capable = false; 
				return;
			}else if(versionStr != 0){
				var versionArray;
				if(dojo.render.html.ie){
					var tempArray = versionStr.split(" ");
					var tempString = tempArray[1];
					versionArray = tempString.split(",");
				}else{
					versionArray = versionStr.split(".");
				}
					
				this.versionMajor = versionArray[0];
				this.versionMinor = versionArray[1];
				this.versionRevision = versionArray[2];
				
				// 7.0r24 == 7.24
				var versionString = this.versionMajor + "." + this.versionRevision;
				this.version = parseFloat(versionString);
				
				this.capable = true;
				
				break;
			}
		}
	},
	 
	// JavaScript helper required to detect Flash Player PlugIn version 
	// information. Internet Explorer uses a corresponding Visual Basic
	// version to interact with the Flash ActiveX control. 
	_JSFlashInfo: function(testVersion){
		// NS/Opera version >= 3 check for Flash plugin in plugin array
		if(navigator.plugins != null && navigator.plugins.length > 0){
			if(navigator.plugins["Shockwave Flash 2.0"] || 
				 navigator.plugins["Shockwave Flash"]){
				var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
				var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
				var descArray = flashDescription.split(" ");
				var tempArrayMajor = descArray[2].split(".");
				var versionMajor = tempArrayMajor[0];
				var versionMinor = tempArrayMajor[1];
				if(descArray[3] != ""){
					var tempArrayMinor = descArray[3].split("r");
				}else{
					var tempArrayMinor = descArray[4].split("r");
				}
				var versionRevision = tempArrayMinor[1] > 0 ? tempArrayMinor[1] : 0;
				var version = versionMajor + "." + versionMinor + "." 
											+ versionRevision;
											
				return version;
			}
		}
		
		return -1;
	},
	
	// Detects the mechanisms that should be used for Flash/JavaScript 
	// communication, setting 'commVersion' to either 6 or 8. If the value is
	// 6, we use Flash Plugin 6+ features, such as GetVariable, TCallLabel,
	// and fscommand, to do Flash/JavaScript communication; if the value is
	// 8, we use the ExternalInterface API for communication. 
	_detectCommunicationVersion: function(){
		if(this.capable == false){
			this.commVersion = null;
			return;
		}
		
		// detect if the user has over-ridden the default flash version
		if (typeof djConfig["forceFlashComm"] != "undefined" &&
				typeof djConfig["forceFlashComm"] != null){
			this.commVersion = djConfig["forceFlashComm"];
			return;
		}
		
		// we prefer Flash 6 features over Flash 8, because they are much faster
		// and much less buggy
		
		// at this point, we don't have a flash file to detect features on,
		// so we need to instead look at the browser environment we are in
		if(dojo.render.html.safari == true || dojo.render.html.opera == true){
			this.commVersion = 8;
		}else{
			this.commVersion = 6;
		}
	}
};

dojo.flash.Embed = function(visible){
	// summary: A class that is used to write out the Flash object into the page.
	
	this._visible = visible;
}

dojo.flash.Embed.prototype = {
	// width: int
	//	The width of this Flash applet. The default is the minimal width
	//	necessary to show the Flash settings dialog. Current value is 
	//  215 pixels.
	width: 215,
	
	// height: int 
	//	The height of this Flash applet. The default is the minimal height
	//	necessary to show the Flash settings dialog. Current value is
	// 138 pixels.
	height: 138,
	
	// id: String
	// 	The id of the Flash object. Current value is 'flashObject'.
	id: "flashObject",
	
	// Controls whether this is a visible Flash applet or not.
	_visible: true,

	protocol: function(){
		switch(window.location.protocol){
			case "https:":
				return "https";
				break;
			default:
				return "http";
				break;
		}
	},
	
	write: function(/* String */ flashVer, /* Boolean? */ doExpressInstall){
		// summary: Writes the Flash into the page.
		// description:
		//	This must be called before the page
		//	is finished loading. 
		// flashVer: String
		//	The Flash version to write.
		// doExpressInstall: Boolean
		//	Whether to write out Express Install
		//	information. Optional value; defaults to false.
		
		//dojo.debug("write");
		if(dojo.lang.isUndefined(doExpressInstall)){
			doExpressInstall = false;
		}
		
		// determine our container div's styling
		var containerStyle = new dojo.string.Builder();
		containerStyle.append("width: " + this.width + "px; ");
		containerStyle.append("height: " + this.height + "px; ");
		if(this._visible == false){
			containerStyle.append("position: absolute; ");
			containerStyle.append("z-index: 10000; ");
			containerStyle.append("top: -1000px; ");
			containerStyle.append("left: -1000px; ");
		}
		containerStyle = containerStyle.toString();

		// figure out the SWF file to get and how to write out the correct HTML
		// for this Flash version
		var objectHTML;
		var swfloc;
		// Flash 6
		if(flashVer == 6){
			swfloc = dojo.flash.flash6_version;
			var dojoPath = "http://pontus:7080/" + djConfig.baseRelativePath;
			swfloc = swfloc + "?baseRelativePath=" + escape(dojoPath);
			objectHTML = 
						  '<embed id="' + this.id + '" src="' + swfloc + '" '
						+ '    quality="high" bgcolor="#ffffff" '
						+ '    width="' + this.width + '" height="' + this.height + '" '
						+ '    name="' + this.id + '" '
						+ '    align="middle" allowScriptAccess="sameDomain" '
						+ '    type="application/x-shockwave-flash" swLiveConnect="true" '
						+ '    pluginspage="'
						+ this.protocol()
						+ '://www.macromedia.com/go/getflashplayer">';
		}else{ // Flash 8
			swfloc = dojo.flash.flash8_version;
			var swflocObject = swfloc;
			var swflocEmbed = swfloc;
			var dojoPath = "http://pontus:7080/" + djConfig.baseRelativePath;
			if(doExpressInstall){
				// the location to redirect to after installing
				var redirectURL = escape(window.location);
				document.title = document.title.slice(0, 47) + " - Flash Player Installation";
				var docTitle = escape(document.title);
				swflocObject += "?MMredirectURL=" + redirectURL
				                + "&MMplayerType=ActiveX"
				                + "&MMdoctitle=" + docTitle
								+ "&baseRelativePath=" + escape(dojoPath);
				swflocEmbed += "?MMredirectURL=" + redirectURL 
								+ "&MMplayerType=PlugIn"
								+ "&baseRelativePath=" + escape(dojoPath);
			}

			if(swflocEmbed.indexOf("?") == -1){
				swflocEmbed +=  "?baseRelativePath="+escape(dojoPath)+"' ";
			}
			
			objectHTML =
				'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '
				  + 'codebase="'
					+ this.protocol()
					+ '://fpdownload.macromedia.com/pub/shockwave/cabs/flash/'
					+ 'swflash.cab#version=8,0,0,0" '
				  + 'width="' + this.width + '" '
				  + 'height="' + this.height + '" '
				  + 'id="' + this.id + '" '
				  + 'align="middle"> '
				  + '<param name="allowScriptAccess" value="sameDomain" /> '
				  + '<param name="movie" value="' + swflocObject + '" /> '
				  + '<param name="quality" value="high" /> '
				  + '<param name="bgcolor" value="#ffffff" /> '
				  + '<embed src="' + swflocEmbed + "' "
				  + 'quality="high" '
				  + 'bgcolor="#ffffff" '
				  + 'width="' + this.width + '" '
				  + 'height="' + this.height + '" '
				  + 'id="' + this.id + '" '
				  + 'name="' + this.id + '" '
				  + 'swLiveConnect="true" '
				  + 'align="middle" '
				  + 'allowScriptAccess="sameDomain" '
				  + 'type="application/x-shockwave-flash" '
				  + 'pluginspage="'
					+ this.protocol()
					+'://www.macromedia.com/go/getflashplayer" />'
				+ '</object>';
		}

		// now write everything out
		objectHTML = '<div id="' + this.id + 'Container" style="' + containerStyle + '"> '
						+ objectHTML
					 + '</div>';
		document.writeln(objectHTML);
	},  
	
	get: function(){ /* Object */
		// summary: Gets the Flash object DOM node.
		
		//return (dojo.render.html.ie) ? window[this.id] : document[this.id];
		
		// more robust way to get Flash object; version above can break
		// communication on IE sometimes
		return document.getElementById(this.id);
	},
	
	setVisible: function(/* Boolean */ visible){
		// summary: Sets the visibility of this Flash object.
		
		var container = dojo.byId(this.id + "Container");
		if(visible == true){
			container.style.visibility = "visible";
		}else{
			container.style.position = "absolute";
			container.style.x = "-1000px";
			container.style.y = "-1000px";
			container.style.visibility = "hidden";
		}
	},
	
	center: function(){
		// summary: Centers the flash applet on the page.
		
		var elementWidth = this.width;
		var elementHeight = this.height;

		var scroll_offset = dojo.html.getScroll().offset;
		var viewport_size = dojo.html.getViewport();

		// compute the centered position    
		var x = scroll_offset.x + (viewport_size.width - elementWidth) / 2;
		var y = scroll_offset.y + (viewport_size.height - elementHeight) / 2; 

		// set the centered position
		var container = dojo.byId(this.id + "Container");
		container.style.top = y + "px";
		container.style.left = x + "px";
	}
};


dojo.flash.Communicator = function(){
	// summary:
	//	A class that is used to communicate between Flash and JavaScript in 
	//	a way that can pass large amounts of data back and forth reliably,
	//	very fast, and with synchronous method calls.
	// description: 
	//	A class that is used to communicate between Flash and JavaScript in 
	//	a way that can pass large amounts of data back and forth reliably,
	//	very fast, and with synchronous method calls. This class encapsulates the 
	//	specific way in which this communication occurs,
	//	presenting a common interface to JavaScript irrespective of the underlying
	//	Flash version.

	if(dojo.flash.useFlash6()){
		this._writeFlash6();
	}else if (dojo.flash.useFlash8()){
		this._writeFlash8();
	}
}

dojo.flash.Communicator.prototype = {
	_writeFlash6: function(){
		var id = dojo.flash.obj.id;
		
		// global function needed for Flash 6 callback;
		// we write it out as a script tag because the VBScript hook for IE
		// callbacks does not work properly if this function is evalled() from
		// within the Dojo system
		document.writeln('<script language="JavaScript">');
		document.writeln('  function ' + id + '_DoFSCommand(command, args){ ');
		document.writeln('    dojo.flash.comm._handleFSCommand(command, args); ');
		document.writeln('}');
		document.writeln('</script>');
		
		// hook for Internet Explorer to receive FSCommands from Flash
		if(dojo.render.html.ie){
			document.writeln('<SCRIPT LANGUAGE=VBScript\> ');
			document.writeln('on error resume next ');
			document.writeln('Sub ' + id + '_FSCommand(ByVal command, ByVal args)');
			document.writeln(' call ' + id + '_DoFSCommand(command, args)');
			document.writeln('end sub');
			document.writeln('</SCRIPT\> ');
		}
	},
	
	_writeFlash8: function(){
		// nothing needs to be written out for Flash 8 communication; 
		// happens automatically
	},
	
	//Flash 6 communication.
	
	// Handles fscommand's from Flash to JavaScript. Flash 6 communication.
	_handleFSCommand: function(command, args){
		//dojo.debug("fscommand, command="+command+", args="+args);
		// Flash 8 on Mac/Firefox precedes all commands with the string "FSCommand:";
		// strip it off if it is present
		if(command != null && !dojo.lang.isUndefined(command)
			&& /^FSCommand:(.*)/.test(command) == true){
			command = command.match(/^FSCommand:(.*)/)[1];
		}
		 
		if(command == "addCallback"){ // add Flash method for JavaScript callback
			this._fscommandAddCallback(command, args);
		}else if(command == "call"){ // Flash to JavaScript method call
			this._fscommandCall(command, args);
		}else if(command == "fscommandReady"){ // see if fscommands are ready
			this._fscommandReady();
		}
	},
	
	// Handles registering a callable Flash function. Flash 6 communication.
	_fscommandAddCallback: function(command, args){
		var functionName = args;
			
		// do a trick, where we link this function name to our wrapper
		// function, _call, that does the actual JavaScript to Flash call
		var callFunc = function(){
			return dojo.flash.comm._call(functionName, arguments);
		};			
		dojo.flash.comm[functionName] = callFunc;
		
		// indicate that the call was successful
		dojo.flash.obj.get().SetVariable("_succeeded", true);
	},
	
	// Handles Flash calling a JavaScript function. Flash 6 communication.
	_fscommandCall: function(command, args){
		var plugin = dojo.flash.obj.get();
		var functionName = args;
		
		// get the number of arguments to this method call and build them up
		var numArgs = parseInt(plugin.GetVariable("_numArgs"));
		var flashArgs = new Array();
		for(var i = 0; i < numArgs; i++){
			var currentArg = plugin.GetVariable("_" + i);
			flashArgs.push(currentArg);
		}
		
		// get the function instance; we technically support more capabilities
		// than ExternalInterface, which can only call global functions; if
		// the method name has a dot in it, such as "dojo.flash.loaded", we
		// eval it so that the method gets run against an instance
		var runMe;
		if(functionName.indexOf(".") == -1){ // global function
			runMe = window[functionName];
		}else{
			// instance function
			runMe = eval(functionName);
		}
		
		// make the call and get the results
		var results = null;
		if(!dojo.lang.isUndefined(runMe) && runMe != null){
			results = runMe.apply(null, flashArgs);
		}
		
		// return the results to flash
		plugin.SetVariable("_returnResult", results);
	},
	
	// Reports that fscommands are ready to run if executed from Flash.
	_fscommandReady: function(){
		var plugin = dojo.flash.obj.get();
		plugin.SetVariable("fscommandReady", "true");
	},
	
	// The actual function that will execute a JavaScript to Flash call; used
	// by the Flash 6 communication method. 
	_call: function(functionName, args){
		// we do JavaScript to Flash method calls by setting a Flash variable
		// "_functionName" with the function name; "_numArgs" with the number
		// of arguments; and "_0", "_1", etc for each numbered argument. Flash
		// reads these, executes the function call, and returns the result
		// in "_returnResult"
		var plugin = dojo.flash.obj.get();
		plugin.SetVariable("_functionName", functionName);
		plugin.SetVariable("_numArgs", args.length);
		for(var i = 0; i < args.length; i++){
			// unlike Flash 8's ExternalInterface, Flash 6 has no problem with
			// any special characters _except_ for the null character \0; double
			// encode this so the Flash side never sees it, but we can get it 
			// back if the value comes back to JavaScript
			var value = args[i];
			value = value.replace(/\0/g, "\\0");
			
			plugin.SetVariable("_" + i, value);
		}
		
		// now tell Flash to execute this method using the Flash Runner
		plugin.TCallLabel("/_flashRunner", "execute");
		
		// get the results
		var results = plugin.GetVariable("_returnResult");
		
		// we double encoded all null characters as //0 because Flash breaks
		// if they are present; turn the //0 back into /0
		results = results.replace(/\\0/g, "\0");
		
		return results;
	},
	
	// Flash 8 communication.
	
	// Registers the existence of a Flash method that we can call with
	// JavaScript, using Flash 8's ExternalInterface. 
	_addExternalInterfaceCallback: function(methodName){
		var wrapperCall = function(){
			// some browsers don't like us changing values in the 'arguments' array, so
			// make a fresh copy of it
			var methodArgs = new Array(arguments.length);
			for(var i = 0; i < arguments.length; i++){
				methodArgs[i] = arguments[i];
			}
			return dojo.flash.comm._execFlash(methodName, methodArgs);
		};
		
		dojo.flash.comm[methodName] = wrapperCall;
	},
	
	// Encodes our data to get around ExternalInterface bugs.
	// Flash 8 communication.
	_encodeData: function(data){
		// double encode all entity values, or they will be mis-decoded
		// by Flash when returned
		var entityRE = /\&([^;]*)\;/g;
		data = data.replace(entityRE, "&amp;$1;");
		
		// entity encode XML-ish characters, or Flash's broken XML serializer
		// breaks
		data = data.replace(/</g, "&lt;");
		data = data.replace(/>/g, "&gt;");
		
		// transforming \ into \\ doesn't work; just use a custom encoding
		data = data.replace("\\", "&custom_backslash;&custom_backslash;");
		
		data = data.replace(/\n/g, "\\n");
		data = data.replace(/\r/g, "\\r");
		data = data.replace(/\f/g, "\\f");
		data = data.replace(/\0/g, "\\0"); // null character
		data = data.replace(/\'/g, "\\\'");
		data = data.replace(/\"/g, '\\\"');
		
		return data;
	},
	
	// Decodes our data to get around ExternalInterface bugs.
	// Flash 8 communication.
	_decodeData: function(data){
		if(data == null || typeof data == "undefined"){
			return data;
		}
		
		// certain XMLish characters break Flash's wire serialization for
		// ExternalInterface; these are encoded on the 
		// DojoExternalInterface side into a custom encoding, rather than
		// the standard entity encoding, because otherwise we won't be able to
		// differentiate between our own encoding and any entity characters
		// that are being used in the string itself
		data = data.replace(/\&custom_lt\;/g, "<");
		data = data.replace(/\&custom_gt\;/g, ">");
		
		// Unfortunately, Flash returns us our String with special characters
		// like newlines broken into seperate characters. So if \n represents
		// a new line, Flash returns it as "\" and "n". This means the character
		// is _not_ a newline. This forces us to eval() the string to cause
		// escaped characters to turn into their real special character values.
		data = eval('"' + data + '"');
		
		return data;
	},
	
	// Sends our method arguments over to Flash in chunks in order to
	// have ExternalInterface's performance not be O(n^2).
	// Flash 8 communication.
	_chunkArgumentData: function(value, argIndex){
		var plugin = dojo.flash.obj.get();
		
		// cut up the string into pieces, and push over each piece one
		// at a time
		var numSegments = Math.ceil(value.length / 1024);
		for(var i = 0; i < numSegments; i++){
			var startCut = i * 1024;
			var endCut = i * 1024 + 1024;
			if(i == (numSegments - 1)){
				endCut = i * 1024 + value.length;
			}
			
			var piece = value.substring(startCut, endCut);
			
			// encode each piece seperately, rather than the entire
			// argument data, because ocassionally a special 
			// character, such as an entity like &foobar;, will fall between
			// piece boundaries, and we _don't_ want to encode that value if
			// it falls between boundaries, or else we will end up with incorrect
			// data when we patch the pieces back together on the other side
			piece = this._encodeData(piece);
			
			// directly use the underlying CallFunction method used by
			// ExternalInterface, which is vastly faster for large strings
			// and lets us bypass some Flash serialization bugs
			plugin.CallFunction('<invoke name="chunkArgumentData" '
														+ 'returntype="javascript">'
														+ '<arguments>'
														+ '<string>' + piece + '</string>'
														+ '<number>' + argIndex + '</number>'
														+ '</arguments>'
														+ '</invoke>');
		}
	},
	
	// Gets our method return data in chunks for better performance.
	// Flash 8 communication.
	_chunkReturnData: function(){
		var plugin = dojo.flash.obj.get();
		
		var numSegments = plugin.getReturnLength();
		var resultsArray = new Array();
		for(var i = 0; i < numSegments; i++){
			// directly use the underlying CallFunction method used by
			// ExternalInterface, which is vastly faster for large strings
			var piece = 
					plugin.CallFunction('<invoke name="chunkReturnData" '
															+ 'returntype="javascript">'
															+ '<arguments>'
															+ '<number>' + i + '</number>'
															+ '</arguments>'
															+ '</invoke>');
															
			// remove any leading or trailing JavaScript delimiters, which surround
			// our String when it comes back from Flash since we bypass Flash's
			// deserialization routines by directly calling CallFunction on the
			// plugin
			if(piece == '""' || piece == "''"){
				piece = "";
			}else{
				piece = piece.substring(1, piece.length-1);
			}
		
			resultsArray.push(piece);
		}
		var results = resultsArray.join("");
		
		return results;
	},
	
	// Executes a Flash method; called from the JavaScript wrapper proxy we
	// create on dojo.flash.comm.
	// Flash 8 communication.
	_execFlash: function(methodName, methodArgs){
		var plugin = dojo.flash.obj.get();
				
		// begin Flash method execution
		plugin.startExec();
		
		// set the number of arguments
		plugin.setNumberArguments(methodArgs.length);
		
		// chunk and send over each argument
		for(var i = 0; i < methodArgs.length; i++){
			this._chunkArgumentData(methodArgs[i], i);
		}
		
		// execute the method
		plugin.exec(methodName);
														
		// get the return result
		var results = this._chunkReturnData();
		
		// decode the results
		results = this._decodeData(results);
		
		// reset everything
		plugin.endExec();
		
		return results;
	}
}

dojo.flash.Install = function(){
	// summary: Helps install Flash plugin if needed.
	// description:
	//	Figures out the best way to automatically install the Flash plugin
	//	for this browser and platform. Also determines if installation or
	//	revving of the current plugin is needed on this platform.
}

dojo.flash.Install.prototype = {
	needed: function(){ /* Boolean */
		// summary:
		//	Determines if installation or revving of the current plugin is 
		//	needed. 
	
		// do we even have flash?
		if(dojo.flash.info.capable == false){
			return true;
		}

		// are we on the Mac? Safari needs Flash version 8 to do Flash 8
		// communication, while Firefox/Mac needs Flash 8 to fix bugs it has
		// with Flash 6 communication
		if(dojo.render.os.mac == true && !dojo.flash.info.isVersionOrAbove(8, 0, 0)){
			return true;
		}

		// other platforms need at least Flash 6 or above
		if(!dojo.flash.info.isVersionOrAbove(6, 0, 0)){
			return true;
		}

		// otherwise we don't need installation
		return false;
	},

	install: function(){
		// summary: Performs installation or revving of the Flash plugin.
		
		//dojo.debug("install");
		// indicate that we are installing
		dojo.flash.info.installing = true;
		dojo.flash.installing();
		
		if(dojo.flash.info.capable == false){ // we have no Flash at all
			//dojo.debug("Completely new install");
			// write out a simple Flash object to force the browser to prompt
			// the user to install things
			var installObj = new dojo.flash.Embed(false);
			installObj.write(8); // write out HTML for Flash 8 version+
		}else if(dojo.flash.info.isVersionOrAbove(6, 0, 65)){ // Express Install
			//dojo.debug("Express install");
			var installObj = new dojo.flash.Embed(false);
			installObj.write(8, true); // write out HTML for Flash 8 version+
			installObj.setVisible(true);
			installObj.center();
		}else{ // older Flash install than version 6r65
			alert("This content requires a more recent version of the Macromedia "
						+" Flash Player.");
			window.location.href = + dojo.flash.Embed.protocol() +
						"://www.macromedia.com/go/getflashplayer";
		}
	},
	
	// Called when the Express Install is either finished, failed, or was
	// rejected by the user.
	_onInstallStatus: function(msg){
		if (msg == "Download.Complete"){
			// Installation is complete.
			dojo.flash._initialize();
		}else if(msg == "Download.Cancelled"){
			alert("This content requires a more recent version of the Macromedia "
						+" Flash Player.");
			window.location.href = dojo.flash.Embed.protocol() +
						"://www.macromedia.com/go/getflashplayer";
		}else if (msg == "Download.Failed"){
			// The end user failed to download the installer due to a network failure
			alert("There was an error downloading the Flash Player update. "
						+ "Please try again later, or visit macromedia.com to download "
						+ "the latest version of the Flash plugin.");
		}	
	}
}

// find out if Flash is installed
dojo.flash.info = new dojo.flash.Info();

// vim:ts=4:noet:tw=0:

