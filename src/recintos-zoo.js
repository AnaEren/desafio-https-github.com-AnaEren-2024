class RecintosZoo {
    constructor() {
        /* TABELA DAS INFORMAÇÕES DOS RECINTOS */
        this.recintos = [
            {n: 1, bioma: ['savana'],        tamanhoTotal: 10, animaisTotais: 3, animais: 'MACACO'},
            {n: 2, bioma: ['floresta'],      tamanhoTotal: 5,  animaisTotais: 0, animais: null },
            {n: 3, bioma: ['savana', 'rio'], tamanhoTotal: 7,  animaisTotais: 1, animais: 'GAZELA'},
            {n: 4, bioma: ['rio'],           tamanhoTotal: 8,  animaisTotais: 0, animais: null },
            {n: 5, bioma: ['savana'],        tamanhoTotal: 9,  animaisTotais: 1, animais: 'LEAO'}
        ];

        /* TABELA DAS INFORMAÇÕES DOS ANIMAIS (CONSTANTE)*/
        this.animalInfo = {
            LEAO:       {tamanho: 3, biomas: ['savana'],             carnivoro: true},
            LEOPARDO:   {tamanho: 2, biomas: ['savana'],             carnivoro: true},
            CROCODILO:  {tamanho: 3, biomas: ['rio'],                carnivoro: true},
            MACACO:     {tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false},
            GAZELA:     {tamanho: 2, biomas: ['savana'],             carnivoro: false},
            HIPOPOTAMO: {tamanho: 4, biomas: ['savana', 'rio'],      carnivoro: false}
        };
    }

    /* Função de análise geral */
    analisaRecintos(animal, quantidade) {
        const animais = this.animalInfo[animal];
        let recintosViaveis = [];

        // verificações iniciais
        if (!animais)
            return {recintosViaveis: false, erro: "Animal inválido"};

        if (quantidade <= 0) 
            return {recintosViaveis: false, erro: "Quantidade inválida"};
        
        // função de filtro
        recintosViaveis = this.encontraRecintosViaveis(animal, quantidade);

        // envio dos retornos finais
        if (recintosViaveis.length === 0)
            return {recintosViaveis: false, erro: "Não há recinto viável"};

        recintosViaveis = recintosViaveis.map(recinto => {
        return `Recinto ${recinto.n} (espaço livre: ${this.calculaEspacoLivre(recinto, animal, quantidade)} total: ${recinto.tamanhoTotal})`;
        });
      
          return {recintosViaveis: recintosViaveis, erro: false};
    }

    /* Função de Filtragem */
    encontraRecintosViaveis(animal, quantidade) {
        return this.recintos
          .filter(recinto => this.verificaBioma(animal, recinto.bioma))
          .filter(recinto => this.verificaAlimentacao(recinto, animal))
          .filter(recinto => this.casoMacaco(recinto, animal, quantidade))
          .filter(recinto => this.verificaEspaco(recinto, animal, quantidade));
     }


    /* Filtragem em ordem de refinamento: */
    
    // Por Bioma 
    verificaBioma(animal, biomasRecinto) {
        return this.animalInfo[animal].biomas.some(bioma => biomasRecinto.includes(bioma));
    }

    // Por alimentação (também verifica o caso dos hipopótamos)
    verificaAlimentacao(recinto, animal, quantidade) {
        if(recinto.animais == null)
            return true;

        // se forem da mesma especies
        if(recinto.animais == animal)
            return true;
      
        // lógica hipopótamos
        const temSavanaRio = recinto.bioma.includes('savana') && recinto.bioma.includes('rio');
        if (((animal == 'HIPOPOTAMO') || (recinto.animais == 'HIPOPOTAMO')) 
            && !temSavanaRio)
          return false;
      
        // lógica carnívoros
        return (!this.animalInfo[recinto.animais].carnivoro && !this.animalInfo[animal].carnivoro)
                || (recinto.animais == animal);
    }
      
    // Especificação dos macacos (dos hipopótamos está no de alimentação)
    casoMacaco(recinto, animal, quantidade){
        if(animal == "MACACO" && quantidade == 1 && recinto.animaisTotais == 0)
            return false;
        return true;
    }

    // Por espaço
    verificaEspaco(recinto, animal, quantidade){
        if (this.calculaEspacoLivre(recinto, animal, quantidade) >= 0)
            return true;
        return false;
    }
    
    // Função para calcular o espaço livre
    calculaEspacoLivre(recinto, animal, quantidade) {
        
        // espaço dos novos animais
        const espacoVaiOcupar = quantidade * this.animalInfo[animal].tamanho;

        if (recinto.animais == null)
            return recinto.tamanhoTotal - espacoVaiOcupar;
    
        // espaço dos animais já existentes
        let espacoJaOcupado = recinto.animaisTotais * this.animalInfo[recinto.animais].tamanho;

        // espécies diferentes ocupam mais um espaço
        if (recinto.animais != animal)
            espacoJaOcupado += 1;
    
        return recinto.tamanhoTotal - (espacoJaOcupado + espacoVaiOcupar);
    }


}

export { RecintosZoo as RecintosZoo };
