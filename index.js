#!/usr/bin/env node
const version = '1.0.2'
const path = require('path')
const {log} = require('./utils')
const sif = require('./sif')
const chalk = require('chalk')

const args = process.argv.slice(2)

if(args.length === 0){
    log(`SIF/SQL Injection Finder v.${version}`)
    log('https://www.npmjs.com/package/@marcusfernstrom/sif')
    log()
    log('usage: sif <directory path>')
    process.exit()
}

args[0] = path.resolve(args[0])
const results = sif.scanDirectory(args[0])

log()
log(`SIF/SQL Injection Finder v.${version}`)
log(`Scanning ${results.files.length} files in directory ${args[0]}`)
log()
log('Scan results:')
log(chalk.red('RED') + '    === SIF found risky SQL')
log(chalk.green('GREEN') + '  === SIF did not find risky SQL')
log()

for(const file of results.files){
    if(file.errors.length === 0){
        log(chalk.green(file.path))

    } else {
        // SIF found something
        let eqString = ''
        for(let i = 0; i<= file.path.length + 5; i++ ){eqString += '='}

        // File information
        log(chalk.red(eqString))
        log(chalk.red('>> ' + file.path + ' <<'))
        log(chalk.red(eqString))
        
        // Display each SQL statement
        for(const err of file.errors){
            log(chalk.red('--------------------'))
            log(chalk.red('Risky SQL statement:'))
            log(chalk.red(err))
            log()
        }
    }
}

process.exit(results.foundErrors === true ? 1 : 0)