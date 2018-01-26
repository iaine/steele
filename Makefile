PROJECT=steele

dev:
	DEBUG=$(PROJECT):* npm run devstart

run:
	DEBUG=$(STEELE)steele:* npm run start
