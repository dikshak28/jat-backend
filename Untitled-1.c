#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define SIZE 9
#define MINES 10

void initializeBoard(char board[SIZE][SIZE], char displayBoard[SIZE][SIZE]);
void placeMines(char board[SIZE][SIZE]);
void calculateHints(char board[SIZE][SIZE]);
void printBoard(char board[SIZE][SIZE]);
int isMine(char board[SIZE][SIZE], int row, int col);
int countAdjacentMines(char board[SIZE][SIZE], int row, int col);
void revealBoard(char board[SIZE][SIZE], char displayBoard[SIZE][SIZE], int row, int col);
int checkWin(char displayBoard[SIZE][SIZE]);

int main() {
    char board[SIZE][SIZE];
    char displayBoard[SIZE][SIZE];
    int row, col;
    char action;
    int gameOver = 0;
    int win = 0;

    srand(time(0));
    initializeBoard(board, displayBoard);
    placeMines(board);
    calculateHints(board);

    while (!gameOver && !win) {
        printBoard(displayBoard);
        printf("Enter your move (row col): ");
        scanf("%d %d", &row, &col);
        printf("Reveal or Flag (r/f): ");
        scanf(" %c", &action);

        if (action == 'r') {
            if (isMine(board, row, col)) {
                gameOver = 1;
                printf("Game Over! You hit a mine!\n");
                revealBoard(board, displayBoard, row, col);
                printBoard(displayBoard);
            } else {
                revealBoard(board, displayBoard, row, col);
                win = checkWin(displayBoard);
                if (win) {
                    printf("Congratulations! You've cleared the board!\n");
                    revealBoard(board, displayBoard, row, col);
                    printBoard(displayBoard);
                }
            }
        } else if (action == 'f') {
            displayBoard[row][col] = 'F';
        }
    }

    return 0;
}

void initializeBoard(char board[SIZE][SIZE], char displayBoard[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            board[i][j] = '0';
            displayBoard[i][j] = '*';
        }
    }
}

void placeMines(char board[SIZE][SIZE]) {
    int placedMines = 0;
    while (placedMines < MINES) {
        int row = rand() % SIZE;
        int col = rand() % SIZE;
        if (board[row][col] != 'M') {
            board[row][col] = 'M';
            placedMines++;
        }
    }
}

void calculateHints(char board[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            if (board[i][j] != 'M') {
                board[i][j] = '0' + countAdjacentMines(board, i, j);
            }
        }
    }
}

int countAdjacentMines(char board[SIZE][SIZE], int row, int col) {
    int count = 0;
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            int newRow = row + i;
            int newCol = col + j;
            if (newRow >= 0 && newRow < SIZE && newCol >= 0 && newCol < SIZE) {
                if (board[newRow][newCol] == 'M') {
                    count++;
                }
            }
        }
    }
    return count;
}

void printBoard(char board[SIZE][SIZE]) {
    printf("\n");
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            printf("%c ", board[i][j]);
        }
        printf("\n");
    }
    printf("\n");
}

int isMine(char board[SIZE][SIZE], int row, int col) {
    return board[row][col] == 'M';
}

void revealBoard(char board[SIZE][SIZE], char displayBoard[SIZE][SIZE], int row, int col) {
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE || displayBoard[row][col] != '*') {
        return;
    }

    displayBoard[row][col] = board[row][col];

    if (board[row][col] == '0') {
        for (int i = -1; i <= 1; i++) {
            for (int j = -1; j <= 1; j++) {
                revealBoard(board, displayBoard, row + i, col + j);
            }
        }
    }
}

int checkWin(char displayBoard[SIZE][SIZE]) {
    for (int i = 0; i < SIZE; i++) {
        for (int j = 0; j < SIZE; j++) {
            if (displayBoard[i][j] == '*' && displayBoard[i][j] != 'F') {
                return 0;
            }
        }
    }
    return 1;
}
