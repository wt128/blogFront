#include <stdio.h> //printf(), fprintf(), perror()
#include <sys/socket.h> //socket(), connect(), recv()
#include <arpa/inet.h> // struct sockaddr_in, struct sockaddr, inet_ntoa(), inet_aton()
#include <stdlib.h> //atoi(), exit(), EXIT_FAILURE, EXIT_SUCCESS
#include <string.h> //memset()
#include <unistd.h> //close()

#define MSGSIZE 32
#define MAX_MSGSIZE 1024
#define BUFSIZE (MSGSIZE + 1)

int main(int argc,char* argv[]){
    int sock; //local socket descripter
    struct sockaddr_in servSockAddr;
    unsigned short servPort;
    char recvBuffer[BUFSIZE];
    int byteRcvd, totalBytesRcvd;

    if(argc != 3){
        fprintf(stderr,"argument count mismatch error.\n");
        exit(1);
    }

    memset(&servSockAddr,0,sizeof(servSockAddr));
    servSockAddr.sin_family = AF_INET;

    if(inet_aton(argv[1],&servSockAddr.sin_addr) == 0){
        fprintf(stderr,"Invalid IP Address.\n");
        exit(1);
    }

    if((servPort = (unsigned short) atoi(argv[2])) == 0){
        fprintf(stderr,"Invalid port number.\n");
        exit(1);
    }
    servSockAddr.sin_port = htons(servPort);

    if((sock = socket(PF_INET, SOCK_STREAM,IPPROTO_TCP)) < 0){
        perror("socket() failed.");
        exit(1);
    }

    if(connect(sock, (struct sockaddr*) &servSockAddr,sizeof(servSockAddr)) < 0){
        perror("connet() failed.");
        exit(1);
    }

    printf("connect to %s\n",inet_ntoa(servSockAddr.sin_addr));

    totalBytesRcvd = 0;
    while (totalBytesRcvd < MAX_MSGSIZE)
    {
        if((byteRcvd = recv(sock, recvBuffer, MEGSIZE,0)) > 0){
            recvBuffer[byteRcvd] = '\0';
            printf("%s",recvBuffer);
            totalBytesRcvd += byteRcvd;
        } else if(byteRcvd == 0){
            perror("ERR_EMPTY_RESPONSE");
            exit(1);
        } else {
            perror("recv() failed.");
            exit(1);
        }
      
    }
    printf("\n");
    close(sock);
    return 0;
    
}