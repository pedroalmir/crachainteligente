void setup() {
  // put your setup code here, to run once:
  // Define o pino 13 como saida
  pinMode(13, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(13, HIGH); // Acende o Led
  delay(1000); // Aguarda 1 segundo
  digitalWrite(13, LOW); // Apaga o Led
  delay(1000); // Aguarda 1 segundo
}
