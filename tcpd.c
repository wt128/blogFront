#include <stdio.h> //printf(), fprintf(), perror()
#include <sys/socket.h> //socket(), bind(), accept(), listen()
#include <arpa/inet.h> // struct sockaddr_in, struct sockaddr, inet_ntoa()
#include <stdlib.h> //atoi(), exit(), EXIT_FAILURE, EXIT_SUCCESS
#include <string.h> //memset()
#include <unistd.h> //close()

#define QUEUELIMIT 5

int main(int argc,char* argv[]){
    int servSock; //server socke
    int clitSock;
    struct sockaddr_in servSockAddr; // server internet addres
    struct sockaddr_in clitSockAddr;
    unsigned short servPort; // server port
    unsigned int clitLen; // client internet socket address len

    if ( argc != 2) {
        fprintf(stderr, "argument count mismatch error.\n");
        exit(EXIT_FAILURE);
    }

    if((servPort = (unsigned short)atoi(argv[1])) == 0){
        fprintf(stderr,"invalid port number.\n");
        exit(1);
    }
    if((servSock = socket(PF_INET,SOCK_STREAM,IPPROTO_TCP)) < 0){
        perror("socket() failed.\n");
        exit(1);
    }

    memset(&servSockAddr, 0 ,sizeof(servSockAddr));
    servSockAddr.sin_family = AF_INET;
    servSockAddr.sin_addr.s_addr = htonl(INADDR_ANY);
    servSockAddr.sin_port = htons(servPort);

    if(bind(servSock,(struct sockaddr *) &servSockAddr,sizeof(servSockAddr)) < 0){
        perror("bind() failed.");
        exit(EXIT_FAILURE);
    }
    if(listen(servSock,QUEUELIMIT) < 0){
        perror("listen() failed.");
        exit(1);
    }
    while(1){
        clitLen = sizeof(clitSockAddr);
        if((clitLen) = accept(servSock,(struct sockaddr *) &clitSockAddr,&clitLen) < 0){
            perror("accept() failed.");
            exit(1);
        }

        printf("connected from %s.\n",inet_ntoa(clitSockAddr.sin_addr));
        close(clitSock);
    }

    return 0;
}