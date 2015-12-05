refreshDocuments = function() {
    CurrentSession.documentsRandomSeed = Random.id();
}

checkForNewVersion = function() {
    log('Checking for new version');
	HTTP.get(dr.versionFile, function(error, result) {
		log('Current version:', dr.version)
		log('Latest version:', result.content)
		var isNew = parseInt(result.content.replace(/\./g, '')) > parseInt(dr.version.replace(/\./g, ''));
		log('Got new? ', isNew)
		Session.set('NewVersionAvailable', isNew);
	});
}