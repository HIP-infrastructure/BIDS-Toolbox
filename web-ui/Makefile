.DEFAULT_GOAL := help

include .env
export

require:
	@echo "Checking the programs required for the build are installed..."
	@node --version >/dev/null 2>&1 || (echo "ERROR: node is required."; exit 1)

#dep: @ Install all depencies defined in package.json
dep:
	npm install

#test: @ Run all tests
test: t.prettier t.lint 

#t.prettier: @ Prettify the source code
t.prettier:
	npm run prettier

#t.lint: @ Checks the source code against defined coding standard rules
t.lint:
	npm run lint

#build: @ Builds the project
build: dep b.bundle 

#b.clean: @ Removes all build artifacts
b.clean:
	sudo rm -rf build 

#b.bundle: @ Builds the application as a JavaScript bundle
b.bundle:
	npm run build -- --NODE_ENV=production

#release: @ Release on GitHub, tag the application with appinfo/info.xml 
release: build
	./release.sh	

#help:	@ List available tasks on this project
help:
	@grep -E '[a-zA-Z\.\-]+:.*?@ .*$$' $(MAKEFILE_LIST)| tr -d '#'  | awk 'BEGIN {FS = ":.*?@ "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

