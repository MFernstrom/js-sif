const fs = require('fs')
const recursiveReadSync = require('recursive-readdir-sync')

module.exports = {
    analyze(fileContent){
        const re = /\.query\(/g
        let errors = []
        const fileLen = fileContent.length -1

        // Find and loop queries
        while ((match = re.exec(fileContent)) != null) {
            match.index = match.index + 7
            let position = match.index
            let addSqlAfterLoop = false

            // Get SQL to analyze
            let stringMarker = ''
            let foundSecondStringMarker = false
            let sqlToScan = ''

            while(position < fileLen){
                if(stringMarker === '' && (fileContent[position] === '"' || fileContent[position] === "'" || fileContent[position] === '`') ){
                    stringMarker = fileContent[position]
                } else {
                    sqlToScan += fileContent[position]
                    position++
                    
                    if(fileContent[position] === stringMarker){
                        foundSecondStringMarker = true
                        continue
                    }

                    if(foundSecondStringMarker && fileContent[position] === ','){ break }
                    if(foundSecondStringMarker && fileContent[position] === '+'){ addSqlAfterLoop = true }
                }
            }

            if(addSqlAfterLoop || (stringMarker === '`' && sqlToScan.match(/\$\{/) != null)){
                errors.push(sqlToScan)
            }
        }

        return errors
    },

    scanDirectory(directory){
        let scanResults = {
            foundErrors: false,
            files: []
        }
        
        const $this = this
        
        try {
            // Get all files
            const rawFilesList = recursiveReadSync(directory)

            // Remove non-js files from array
            const files = rawFilesList.filter(function(value, index, arr){
                return value.endsWith('.js')
            })
            
            for(const file of files){
                const relativePath = file.substr(directory.length +1)
                const fileContent = fs.readFileSync(file, { encoding: 'utf8' })
                const results = $this.analyze(fileContent)
                scanResults.files.push({path: relativePath, errors: results})
                if(results.length > 0){
                    scanResults.foundErrors = true
                }
            }

            return scanResults
        } catch(err) {
            console.log(err)
        }
    }
}