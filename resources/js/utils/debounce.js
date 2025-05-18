/**
 * Opções de configuração para o debounce:
 *
 * @param {boolean} [leading=false] - Quando `true`, executa a função IMEDIATAMENTE no primeiro clique/chamada.
 * Exemplo útil: evitar múltiplos cliques em botões de envio (ação dispara no primeiro clique, ignora os subsequentes).
 *
 * @param {boolean} [trailing=true] - Quando `true`, executa a função APÓS o fim do delay, quando não há mais chamadas.
 * Exemplo útil: buscar sugestões de busca somente depois que o usuário para de digitar.
 *
 * Comportamentos:
 * - Se AMBOS forem `true`:
 *   Executa no primeiro clique (leading) e agenda outra execução no trailing (útil para ações que precisam
 *   de feedback imediato E atualização após interação completa).
 * - Se AMBOS forem `false`: O debounce será desativado (não recomendado).
 *
 * Prioridade:
 * - Se houver múltiplas chamadas em sequência, o `trailing` sempre representará a última chamada.
 */
export const debounce = (fn, delay = 200, { leading = false, trailing = true } = {}) => {
    let timeoutId;
    let lastCall = 0;
    let calledAfterLeading = false;

    return function (...args) {
        const context = this;
        const execute = () => {
            lastCall = Date.now();
            fn.apply(context, args);
            calledAfterLeading = false;
        };

        const elapsed = Date.now() - lastCall;
        const currentDelay = typeof delay === 'function' ? delay() : delay;
        const shouldCallLeading = leading && !timeoutId;

        clearTimeout(timeoutId);

        if(shouldCallLeading && elapsed > currentDelay) {
            execute();
        }else if(leading) {
            calledAfterLeading = !!timeoutId;
        }

        if(trailing) {
            timeoutId = setTimeout(() => {
                if(!leading || calledAfterLeading) {
                    execute();
                }
                timeoutId = null;
                calledAfterLeading = false;
            }, currentDelay);
        }
    };
};
