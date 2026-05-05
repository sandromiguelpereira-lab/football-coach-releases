// src/services/brandingService.js
// Serviço para extração automática de cores do logo

/**
 * Extrai cores dominantes de uma imagem (logo)
 * Usa Color Thief para análise de cores
 */
export const extrairCoresDeLogo = async (imagemUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      try {
        // Criar canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Desenhar imagem
        ctx.drawImage(img, 0, 0);
        
        // Obter dados da imagem
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Análise de cores
        const cores = analisarCores(pixels);
        
        resolve({
          principal: cores.principal,
          secundaria: cores.secundaria,
          acento: cores.acento,
          texto: cores.texto
        });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Erro ao carregar imagem'));
    };
    
    img.src = imagemUrl;
  });
};

/**
 * Analisa pixels e extrai cores dominantes
 */
function analisarCores(pixels) {
  const coresContadas = {};
  
  // Contar cores (ignorar pixels muito claros/escuros)
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    // Ignorar pixels transparentes
    if (a < 128) continue;
    
    // Ignorar branco/preto/cinza
    const luminosidade = (r + g + b) / 3;
    if (luminosidade > 240 || luminosidade < 15) continue;
    
    // Arredondar cores para agrupar similares
    const corKey = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
    coresContadas[corKey] = (coresContadas[corKey] || 0) + 1;
  }
  
  // Ordenar cores por frequência
  const coresOrdenadas = Object.entries(coresContadas)
    .sort((a, b) => b[1] - a[1])
    .map(([cor]) => {
      const [r, g, b] = cor.split(',').map(Number);
      return { r, g, b };
    });
  
  if (coresOrdenadas.length === 0) {
    // Fallback para verde Fayal
    return {
      principal: '#00AA00',
      secundaria: '#ffffff',
      acento: '#008800',
      texto: '#000000'
    };
  }
  
  // Principal: cor mais frequente
  const principal = rgbParaHex(coresOrdenadas[0]);
  
  // Secundária: segunda cor mais diferente
  let secundaria = '#ffffff';
  for (let i = 1; i < coresOrdenadas.length; i++) {
    if (diferencaCor(coresOrdenadas[0], coresOrdenadas[i]) > 100) {
      secundaria = rgbParaHex(coresOrdenadas[i]);
      break;
    }
  }
  
  // Acento: versão mais escura da principal
  const acento = escurecerCor(principal, 20);
  
  // Texto: preto ou branco dependendo da luminosidade
  const { r, g, b } = coresOrdenadas[0];
  const lum = (r * 299 + g * 587 + b * 114) / 1000;
  const texto = lum > 128 ? '#000000' : '#ffffff';
  
  return { principal, secundaria, acento, texto };
}

/**
 * Converte RGB para HEX
 */
function rgbParaHex({ r, g, b }) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Calcula diferença entre duas cores
 */
function diferencaCor(cor1, cor2) {
  return Math.sqrt(
    Math.pow(cor1.r - cor2.r, 2) +
    Math.pow(cor1.g - cor2.g, 2) +
    Math.pow(cor1.b - cor2.b, 2)
  );
}

/**
 * Escurece uma cor em HEX
 */
function escurecerCor(hex, porcentagem) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const fator = 1 - (porcentagem / 100);
  
  const novoR = Math.round(r * fator);
  const novoG = Math.round(g * fator);
  const novoB = Math.round(b * fator);
  
  return rgbParaHex({ r: novoR, g: novoG, b: novoB });
}

/**
 * Valida se uma cor em HEX é válida
 */
export const validarCorHex = (hex) => {
  return /^#[0-9A-F]{6}$/i.test(hex);
};

/**
 * Gera tema Material-UI a partir de cores
 */
export const gerarTemaDeCores = (cores) => {
  return {
    palette: {
      primary: {
        main: cores.principal,
        light: escurecerCor(cores.principal, -20),
        dark: cores.acento,
        contrastText: cores.texto,
      },
      secondary: {
        main: cores.secundaria,
        contrastText: cores.principal,
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
  };
};
