#include <dummy.h>

#include <deprecated.h>
#include <MFRC522.h>
#include <MFRC522Extended.h>
#include <require_cpp11.h>


//#include <MFRC522.h> //biblioteca responsável pela comunicação com o módulo RFID-RC522
#include <SPI.h> //biblioteca para comunicação do barramento SPI
 
#define SS_PIN    21
#define RST_PIN   22
 
#define SIZE_BUFFER     18
#define MAX_SIZE_BLOCK  16
 
#define pinVerde     12
#define pinVermelho  32
 
//esse objeto 'chave' é utilizado para autenticação
MFRC522::MIFARE_Key key;
//código de status de retorno da autenticação
//MFRC522::StatusCode status;
 
// Definicoes pino modulo RC522
MFRC522 mfrc522(SS_PIN, RST_PIN);

#define NR_KNOWN_KEYS   8
// Known keys, see: https://code.google.com/p/mfcuk/wiki/MifareClassicDefaultKeys
byte knownKeys[NR_KNOWN_KEYS][MFRC522::MF_KEY_SIZE] =  {
    {0xff, 0xff, 0xff, 0xff, 0xff, 0xff}, // FF FF FF FF FF FF = factory default
    {0xa0, 0xa1, 0xa2, 0xa3, 0xa4, 0xa5}, // A0 A1 A2 A3 A4 A5
    {0xb0, 0xb1, 0xb2, 0xb3, 0xb4, 0xb5}, // B0 B1 B2 B3 B4 B5
    {0x4d, 0x3a, 0x99, 0xc3, 0x51, 0xdd}, // 4D 3A 99 C3 51 DD
    {0x1a, 0x98, 0x2c, 0x7e, 0x45, 0x9a}, // 1A 98 2C 7E 45 9A
    {0xd3, 0xf7, 0xd3, 0xf7, 0xd3, 0xf7}, // D3 F7 D3 F7 D3 F7
    {0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff}, // AA BB CC DD EE FF
    {0x00, 0x00, 0x00, 0x00, 0x00, 0x00}  // 00 00 00 00 00 00
};

/*
 * Helper routine to dump a byte array as hex values to Serial.
 */
void dump_byte_array(byte *buffer, byte bufferSize) {
    for (byte i = 0; i < bufferSize; i++) {
        Serial.print(buffer[i] < 0x10 ? " 0" : " ");
        Serial.print(buffer[i], HEX);
    }
}

/*
 * Try using the PICC (the tag/card) with the given key to access block 0.
 * On success, it will show the key details, and dump the block data on Serial.
 *
 * @return true when the given key worked, false otherwise.
 */
boolean try_key(MFRC522::MIFARE_Key *key){
    boolean result = false;
    byte buffer[18];
    byte block = 0;
    byte status;

    // Serial.println(F("Authenticating using key A..."));
    status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, key, &(mfrc522.uid));
    if (status != MFRC522::STATUS_OK) {
        // Serial.print(F("PCD_Authenticate() failed: "));
        // Serial.println(mfrc522.GetStatusCodeName(status));
        return false;
    }

    // Read block
    byte byteCount = sizeof(buffer);
    status = mfrc522.MIFARE_Read(block, buffer, &byteCount);
    if (status != MFRC522::STATUS_OK) {
        // Serial.print(F("MIFARE_Read() failed: "));
        // Serial.println(mfrc522.GetStatusCodeName(status));
    }else {
        // Successful read
        result = true;
        Serial.print(F("Success with key:"));
        dump_byte_array((*key).keyByte, MFRC522::MF_KEY_SIZE);
        Serial.println();
        // Dump block data
        Serial.print(F("Block ")); Serial.print(block); Serial.print(F(":"));
        dump_byte_array(buffer, 16);
        Serial.println();
    }
    Serial.println();

    mfrc522.PICC_HaltA();       // Halt PICC
    mfrc522.PCD_StopCrypto1();  // Stop encryption on PCD
    return result;
}
 
void setup() {
  // Inicia a serial
  Serial.begin(9600);
  SPI.begin(); // Init SPI bus
 
  pinMode(pinVerde, OUTPUT);
  pinMode(pinVermelho, OUTPUT);
   
  // Inicia MFRC522
  mfrc522.PCD_Init(); 
  // Mensagens iniciais no serial monitor
  Serial.println("Aproxime o seu cartao do leitor...");
  Serial.println();
}

void loop() {
  // Aguarda a aproximacao do cartao
  if (!mfrc522.PICC_IsNewCardPresent()){
    return;
  }
  
  // Seleciona um dos cartoes
  if (!mfrc522.PICC_ReadCardSerial()){
    return;
  }

  leituraDados();
 
  //chama o menu e recupera a opção desejada
  //int opcao = menu();
   
  /*if(opcao == 0){
    //leituraDados();
  }else if(opcao == 1){
    //gravarDados();
  }else {
    Serial.println(F("Opção Incorreta!"));
    return;
  }*/
  // instrui o PICC quando no estado ACTIVE a ir para um estado de "parada"
  mfrc522.PICC_HaltA(); 
  // "stop" a encriptação do PCD, deve ser chamado após a comunicação com autenticação, caso contrário novas comunicações não poderão ser iniciadas
  mfrc522.PCD_StopCrypto1();
}

/** 
 * Faz a leitura dos dados do cartão/tag 
 */
void leituraDados(){
  //imprime os detalhes tecnicos do cartão/tag
  mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid)); 
 
  //Prepara a chave - todas as chaves estão configuradas para FFFFFFFFFFFFh (Padrão de fábrica).
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xff;

  //buffer para colocar os dados ligos
  byte buffer[SIZE_BUFFER] = {0};
 
  //bloco que faremos a operação
  byte bloco = 0;
  byte tamanho = SIZE_BUFFER;
 
  //faz a autenticação do bloco que vamos operar
  byte resultCode = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, bloco, &key, &(mfrc522.uid)); //line 834 of MFRC522.cpp file

  if (resultCode != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed: "));
    //Serial.println(mfrc522.GetStatusCodeName(resultCode));
    digitalWrite(pinVermelho, HIGH);
    delay(1000);
    digitalWrite(pinVermelho, LOW);
    return;
  }
 
  //faz a leitura dos dados do bloco
  resultCode = mfrc522.MIFARE_Read(bloco, buffer, &tamanho);
  if (resultCode != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed: "));
    //Serial.println(mfrc522.GetStatusCodeName(resultCode));
    digitalWrite(pinVermelho, HIGH);
    delay(1000);
    digitalWrite(pinVermelho, LOW);
    return;
  }else{
    digitalWrite(pinVerde, HIGH);
    delay(1000);
    digitalWrite(pinVerde, LOW);
  }
 
  Serial.print(F("\nDados bloco ["));
  Serial.print(bloco);Serial.print(F("]: "));

 mfrc522.MIFARE_Read(bloco, buffer, &tamanho);
  //imprime os dados lidos
  for (uint8_t i = 0; i < MAX_SIZE_BLOCK; i++){
    Serial.write(buffer[i]);
  }
  Serial.println(" ");
  
}

/**
 * Faz a gravação dos dados no cartão/tag
 */
/*void gravarDados(){
  //imprime os detalhes tecnicos do cartão/tag
  mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid)); 
  // aguarda 30 segundos para entrada de dados via Serial
  Serial.setTimeout(30000L) ;     
  Serial.println(F("Insira os dados a serem gravados com o caractere '#' ao final\n[máximo de 16 caracteres]:"));
 
  //Prepara a chave - todas as chaves estão configuradas para FFFFFFFFFFFFh (Padrão de fábrica).
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;
 
  //buffer para armazenamento dos dados que iremos gravar
  byte buffer[MAX_SIZE_BLOCK] = "";
  byte bloco; //bloco que desejamos realizar a operação
  byte tamanhoDados; //tamanho dos dados que vamos operar (em bytes)
 
  //recupera no buffer os dados que o usuário inserir pela serial
  //serão todos os dados anteriores ao caractere '#'
  tamanhoDados = Serial.readBytesUntil('#', (char*)buffer, MAX_SIZE_BLOCK);
  //espaços que sobrarem do buffer são preenchidos com espaço em branco
  for(byte i=tamanhoDados; i < MAX_SIZE_BLOCK; i++){
    buffer[i] = ' ';
  }
  
  bloco = 1; //bloco definido para operação
  String str = (char*)buffer; //transforma os dados em string para imprimir
  Serial.println(str);
 
  //Authenticate é um comando para autenticação para habilitar uma comuinicação segura
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, bloco, &key, &(mfrc522.uid));
 
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    digitalWrite(pinVermelho, HIGH);
    delay(1000);
    digitalWrite(pinVermelho, LOW);
    return;
  }
  //else Serial.println(F("PCD_Authenticate() success: "));
  
  //Grava no bloco
  status = mfrc522.MIFARE_Write(bloco, buffer, MAX_SIZE_BLOCK);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Write() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    digitalWrite(pinVermelho, HIGH);
    delay(1000);
    digitalWrite(pinVermelho, LOW);
    return;
  }else{
    Serial.println(F("MIFARE_Write() success: "));
    digitalWrite(pinVerde, HIGH);
    delay(1000);
    digitalWrite(pinVerde, LOW);
  }
}*/

/** 
 * Menu para escolha da operação 
 */
int menu(){
  Serial.println(F("\nEscolha uma opção:"));
  Serial.println(F("0 - Leitura de Dados"));
  Serial.println(F("1 - Gravação de Dados\n"));
 
  //fica aguardando enquanto o usuário nao enviar algum dado
  while(!Serial.available()){};
 
  //recupera a opção escolhida
  int op = (int)Serial.read();
  //remove os proximos dados (como o 'enter ou \n' por exemplo) que vão por acidente
  while(Serial.available()) {
    if(Serial.read() == '\n') break; 
    Serial.read();
  }
  return (op-48);//do valor lido, subtraimos o 48 que é o ZERO da tabela ascii
}
