import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Home, 
  DollarSign, 
  Lightbulb, 
  TrendingUp,
  Info,
  Tv,
  Refrigerator,
  Wind,
  Flame,
  Sparkles
} from 'lucide-react';

// Aparelhos pré-configurados para preenchimento rápido
const PRESET_DEVICES = [
  { name: 'Ar-Condicionado Inverter', watts: 1200, hours: 8, icon: Wind },
  { name: 'Geladeira Duplex', watts: 250, hours: 24, icon: Refrigerator },
  { name: 'Televisão LED 55"', watts: 120, hours: 5, icon: Tv },
  { name: 'Chuveiro Elétrico', watts: 5500, hours: 0.7, icon: Flame },
  { name: 'Micro-ondas', watts: 1400, hours: 0.3, icon: Zap },
];

export default function App() {
  // Estado inicial com a tarifa padrão (R$ 0,85 por kWh)
  const [tarifa, setTarifa] = useState(0.85);
  
  // Lista de aparelhos cadastrados (iniciando vazia)
  const [aparelhos, setAparelhos] = useState([]);

  // Formulário
  const [nome, setNome] = useState('');
  const [watts, setWatts] = useState('');
  const [horas, setHoras] = useState('');

  // Cálculo de consumo por aparelho (kWh/mês)
  const calcularConsumoKWh = (potenciaWatts, horasDia) => {
    return (potenciaWatts * horasDia * 30) / 1000;
  };

  // Adicionar novo aparelho
  const handleAdicionar = (e) => {
    e.preventDefault();
    if (!nome.trim() || !watts || !horas) return;

    const novoAparelho = {
      id: Date.now().toString(),
      nome: nome.trim(),
      watts: parseFloat(watts),
      horas: parseFloat(horas),
    };

    setAparelhos([...aparelhos, novoAparelho]);
    setNome('');
    setWatts('');
    setHoras('');
  };

  // Preencher dados rápidos dos presets
  const handleUsarPreset = (preset) => {
    setNome(preset.name);
    setWatts(preset.watts.toString());
    setHoras(preset.hours.toString());
  };

  // Função para remover um único aparelho pelo ID
  const handleRemover = (id) => {
    setAparelhos((prev) => prev.filter((item) => item.id !== id));
  };

  // Função para limpar todos os aparelhos da lista
  const handleLimparTodos = () => {
    if (window.confirm('Tem certeza que deseja excluir todos os aparelhos cadastrados?')) {
      setAparelhos([]);
    }
  };

  // Estatísticas globais
  const estatisticas = useMemo(() => {
    let consumoTotalKWh = 0;
    let maiorGastador = null;
    let maiorConsumo = 0;

    aparelhos.forEach(item => {
      const consumo = calcularConsumoKWh(item.watts, item.horas);
      consumoTotalKWh += consumo;

      if (consumo > maiorConsumo) {
        maiorConsumo = consumo;
        maiorGastador = item;
      }
    });

    const custoTotal = consumoTotalKWh * tarifa;

    return {
      totalKWh: consumoTotalKWh,
      totalReais: custoTotal,
      maiorGastador,
      quantidade: aparelhos.length
    };
  }, [aparelhos, tarifa]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased pb-12">
      {/* Cabeçalho */}
      <header className="bg-slate-800/80 border-b border-slate-700/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
              <Zap className="w-7 h-7 fill-amber-400/20" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
                EnergiaIA
              </h1>
              <p className="text-xs text-slate-400">Economizador Inteligente de Energia</p>
            </div>
          </div>

          {/* Configuração de Tarifa */}
          <div className="flex items-center gap-3 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700 w-full sm:w-auto justify-between sm:justify-start">
            <label htmlFor="tarifa" className="text-xs text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Tarifa (R$/kWh):
            </label>
            <input
              id="tarifa"
              type="number"
              step="0.01"
              min="0.1"
              value={tarifa}
              onChange={(e) => setTarifa(Math.max(0.01, parseFloat(e.target.value) || 0))}
              className="w-20 bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1 text-sm font-semibold text-emerald-400 text-center focus:outline-none focus:border-amber-400 transition"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* COLUNA ESQUERDA: Formulário & Presets */}
        <div className="lg:col-span-5 space-y-6">

          {/* Card do Formulário */}
          <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
            <h2 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              Cadastrar Aparelho
            </h2>

            <form onSubmit={handleAdicionar} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Nome do Aparelho
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ar-Condicionado, Geladeira..."
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Potência (Watts)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 1500"
                    min="1"
                    value={watts}
                    onChange={(e) => setWatts(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Horas de uso/dia
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="24"
                    placeholder="Ex: 8"
                    value={horas}
                    onChange={(e) => setHoras(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                <Plus className="w-5 h-5" /> Adicionar Aparelho
              </button>
            </form>

            {/* Presets de preenchimento rápido */}
            <div className="mt-5 pt-4 border-t border-slate-700/60">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Preenchimento rápido:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_DEVICES.map((preset, idx) => {
                  const Icon = preset.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleUsarPreset(preset)}
                      className="text-xs bg-slate-900/60 hover:bg-slate-700 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-300 flex items-center gap-1.5 transition"
                    >
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dica do Especialista */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold text-amber-300">Dica do EnergiaIA</h3>
              <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                Aparelhos de alta potência térmica (como chuveiros e ar-condicionado) representam mais de 60% da fatura residencial. Reduzir 1 hora de uso diário já gera impacto imediato na conta.
              </p>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Estatísticas e Lista de Aparelhos */}
        <div className="lg:col-span-7 space-y-6">

          {/* Resumo Residencial */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <Zap className="w-4 h-4 text-amber-400" /> Consumo Total
              </div>
              <div className="text-2xl font-bold text-slate-100">
                {estatisticas.totalKWh.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kWh/mês</span>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Custo Mensal
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                R$ {estatisticas.totalReais.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <TrendingUp className="w-4 h-4 text-rose-400" /> Maior Gastador
              </div>
              <div className="text-sm font-semibold text-slate-200 truncate">
                {estatisticas.maiorGastador ? estatisticas.maiorGastador.nome : 'Nenhum'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {estatisticas.maiorGastador 
                  ? `${calcularConsumoKWh(estatisticas.maiorGastador.watts, estatisticas.maiorGastador.horas).toFixed(1)} kWh/mês` 
                  : '-'}
              </div>
            </div>
          </div>

          {/* Lista de Aparelhos */}
          <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-semibold text-slate-200">
                  Aparelhos Cadastrados ({aparelhos.length})
                </h2>
              </div>
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <span className="text-xs text-slate-400">
                  Critério de alerta: &gt; 100 kWh/mês
                </span>
                {aparelhos.length > 0 && (
                  <button
                    onClick={handleLimparTodos}
                    className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Excluir Todos
                  </button>
                )}
              </div>
            </div>

            {aparelhos.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-700/60 rounded-xl">
                <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Nenhum aparelho cadastrado ainda.</p>
                <p className="text-xs text-slate-500 mt-1">Cadastre acima para visualizar os custos da sua casa.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aparelhos.map((item) => {
                  const consumoKWh = calcularConsumoKWh(item.watts, item.horas);
                  const custoReais = consumoKWh * tarifa;
                  const eAltoConsumo = consumoKWh > 100;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        eAltoConsumo 
                          ? 'bg-rose-950/20 border-rose-800/40 hover:border-rose-700/60' 
                          : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        {/* Nome & Specs */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-100">{item.nome}</h3>
                            {eAltoConsumo ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                <AlertTriangle className="w-3 h-3" /> ALERTA DE CONSUMO
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle className="w-3 h-3" /> Controlado
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-400 mt-1">
                            {item.watts}W • {item.horas}h de uso por dia
                          </p>
                        </div>

                        {/* Valores e Botão de Exclusão */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                          <div className="text-left sm:text-right">
                            <div className="text-sm font-bold text-slate-100">
                              {consumoKWh.toFixed(1)} <span className="text-xs font-normal text-slate-400">kWh/mês</span>
                            </div>
                            <div className="text-xs font-semibold text-emerald-400">
                              R$ {custoReais.toFixed(2)}/mês
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemover(item.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-400 hover:text-white hover:bg-rose-600/80 bg-rose-500/10 border border-rose-500/20 rounded-lg transition"
                            title={`Excluir ${item.nome}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>

                      {/* Sugestão Inteligente */}
                      <div className={`mt-3 pt-2.5 border-t text-xs leading-relaxed flex items-start gap-2 ${
                        eAltoConsumo ? 'border-rose-900/40 text-rose-300/90' : 'border-slate-800 text-slate-400'
                      }`}>
                        {eAltoConsumo ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Sugestão EnergiaIA:</strong> Este aparelho consome bastante ({consumoKWh.toFixed(1)} kWh/mês). Considere reduzir o tempo de uso diário ou trocar por um modelo de tecnologia Inverter (Selo A Procel).
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>
                              <strong>Sugestão EnergiaIA:</strong> O consumo de '{item.nome}' está sob controle.
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
