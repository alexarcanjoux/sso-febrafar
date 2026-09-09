/**
 * Superfície pública do DS do SSO.
 *
 * Recorte do Fideliza DS — só o que uma tela de acesso usa — mais os
 * componentes próprios deste projeto (AuthShell, Aviso, ForcaSenha,
 * CodigoInput). Se um componente novo não serve a uma tela de login,
 * ele não pertence a este pacote.
 */

/* --- Recorte do Fideliza DS --- */
export { Button } from './components/Button/index.js';
export { Input } from './components/Input/index.js';
export { FormField } from './components/FormField/index.js';
export { Label } from './components/Label/index.js';
export { Icon } from './components/Icon/index.js';
export { Checkbox } from './components/Checkbox/index.js';
export { Divider } from './components/Divider/index.js';
export { Loading } from './components/Loading/index.js';
export { LoadingButton } from './components/LoadingButton/index.js';

/* --- Específicos do SSO --- */
export { AuthShell } from './components/AuthShell/index.js';
export { CampoEstrelas } from './components/CampoEstrelas/index.js';
export { LinhasDoCentro } from './components/LinhasDoCentro/index.js';
export { Aviso } from './components/Aviso/index.js';
export { ForcaSenha } from './components/ForcaSenha/index.js';
export { CodigoInput } from './components/CodigoInput/index.js';
export { FormNovaSenha } from './components/FormNovaSenha/index.js';
