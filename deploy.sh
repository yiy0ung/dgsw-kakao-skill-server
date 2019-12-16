#!/bin/bash

DOCKER_KAKAO_SERVER_NAME=kakao-skill-server

EXIST_BLUE=$(docker-compose -p ${DOCKER_KAKAO_SERVER_NAME}-blue -f docker-compose.blue.yml ps | grep Up)

if [-z "${EXIST_BLUE}"]; then
  echo "Ver.blue up"

  docker-compose -p ${DOCKER_KAKAO_SERVER_NAME}-blue -f docker-compose.blue.yml up -d

  sleep 10

  docker-compose -p ${DOCKER_KAKAO_SERVER_NAME}-green -f docker-compose.green.yml down
else
  echo "Ver.green up"

  docker-compose -p ${DOCKER_KAKAO_SERVER_NAME}-green -f docker-compose.green.yml up -d

  sleep 10

  docker-compose -p ${DOCKER_KAKAO_SERVER_NAME}-blue -f docker-compose.blue.yml down
fi


