import { PoloModel } from "../../models/polo";

export const polos: PoloModel[] = [
    {
        "id": 2,
        "endereco": "R. Sampaio Marquês, 22 - Pajuçara, Maceió - AL",
        "cep": "57030-160",
        "latitude": "-9,6739546",
        "nome": "Superintendência regional do DNIT em Alagoas",
        "municipio": {
            "nome": "Maceió",
            "id": 2704302
        },
        "longitude": "-35,7181362",
        "uf": {
            "nome": "Alagoas",
            "id": 2,
            "sigla": "AL"
        }
    },
    {
        "id": 7,
        "endereco": "R. Afonso Sarlo, 2340 - Bento Ferreira, Vitória - ES",
        "cep": "29050-790",
        "latitude": "-20,3178888",
        "nome": "Superintendência regional do DNIT em Espírito Santo",
        "municipio": {
            "nome": "Vitória",
            "id": 3205309
        },
        "longitude": "-40,3055323",
        "uf": {
            "nome": "Espírito Santo",
            "id": 7,
            "sigla": "ES"
        }
    },
    {
        "id": 8,
        "endereco": "Av. 24 de Outubro, 311 - St. dos Funcionários, Goiânia - GO",
        "cep": "74543-100",
        "latitude": "-16,6726216",
        "nome": "Superintendência regional do DNIT em Goiás",
        "municipio": {
            "nome": "Goiânia",
            "id": 5208707
        },
        "longitude": "-49,2823321",
        "uf": {
            "nome": "Goiás",
            "id": 8,
            "sigla": "GO"
        }
    }
]