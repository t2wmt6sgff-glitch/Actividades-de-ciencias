"use client";

import { useState } from "react";

type Device = "ios" | "android" | "windows" | "macos" | "chromebook";

const devices: { id: Device; label: string }[] = [
  { id: "ios", label: "iPhone o iPad" },
  { id: "android", label: "Android" },
  { id: "windows", label: "Windows 11" },
  { id: "macos", label: "Mac" },
  { id: "chromebook", label: "Chromebook" },
];

const XDP_URL = "https://xdp.es/";

export function LumiConnectivityHelp({ activityUrl }: { activityUrl: string }) {
  const [device, setDevice] = useState<Device>("ios");
  const [open, setOpen] = useState(false);

  return (
    <section className="lumi-help" aria-labelledby="lumi-help-heading">
      <div className="lumi-help-intro">
        <h2 id="lumi-help-heading">¿No carga la actividad?</h2>
        <p>Si ves un espacio en blanco o la actividad no termina de aparecer, puedes probar otra configuración DNS. Esto no confirma que haya un bloqueo y no garantiza que se solucione.</p>
        <button className="lumi-help-toggle" type="button" aria-expanded={open} aria-controls="lumi-help-content" onClick={() => setOpen((value) => !value)}>
          {open ? "Cerrar guía" : "Ver ayuda de conexión"}
        </button>
      </div>

      {open ? (
        <div id="lumi-help-content" className="lumi-help-content">
          <label htmlFor="lumi-device">¿Qué dispositivo utilizas?</label>
          <select id="lumi-device" value={device} onChange={(event) => setDevice(event.target.value as Device)}>
            {devices.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>

          <p className="lumi-help-warning">Antes de cambiar nada: si el dispositivo es del colegio o está configurado por tu familia, pide permiso a un adulto o al administrador. Cambiar el DNS puede afectar al acceso a otras páginas. No instales perfiles que no procedan de la web oficial de XDP.</p>

          {device === "ios" ? (
            <div className="lumi-device-guide">
              <h3>iPhone o iPad</h3>
              <ol>
                <li>Abre la <a href={XDP_URL} target="_blank" rel="noopener noreferrer">web oficial de XDP.es</a>.</li>
                <li>Busca la guía «iOS / Mac» y sigue el enlace al perfil de configuración que ofrece XDP. Comprueba que el perfil procede de <strong>xdp.es</strong> antes de instalarlo.</li>
                <li>Cuando iOS o iPadOS te lo indique, revisa el perfil y confirma la instalación. No necesitas cambiar los ajustes de DNS de cada red Wi‑Fi si utilizas el perfil oficial.</li>
                <li>Vuelve a esta página y recarga la actividad.</li>
              </ol>
              <p>La configuración manual de DNS de una red Wi‑Fi no se aplica automáticamente a los datos móviles. El perfil de XDP es la opción que debes revisar si quieres cubrir más conexiones.</p>
              <p><a href="https://support.apple.com/es-es/111107" target="_blank" rel="noopener noreferrer">Ayuda oficial de Apple sobre Wi‑Fi</a>.</p>
              <p><strong>Para deshacerlo:</strong> ve a Ajustes → General → VPN y gestión de dispositivos, selecciona el perfil de DNS instalado y elimínalo. Si no aparece, consulta la guía de XDP o pide ayuda a un adulto.</p>
            </div>
          ) : null}

          {device === "macos" ? (
            <div className="lumi-device-guide">
              <h3>Mac</h3>
              <ol>
                <li>Abre la <a href={XDP_URL} target="_blank" rel="noopener noreferrer">web oficial de XDP.es</a>.</li>
                <li>En la guía «iOS / Mac», abre el perfil de configuración publicado por XDP y comprueba que procede de <strong>xdp.es</strong>.</li>
                <li>Revisa la información del perfil antes de instalarlo y sigue las indicaciones de macOS.</li>
                <li>Vuelve a la actividad y recarga la página.</li>
              </ol>
              <p><a href="https://support.apple.com/es-lamr/guide/mac-help/mh14127/mac" target="_blank" rel="noopener noreferrer">Ayuda oficial de Apple para cambiar el DNS manualmente</a>.</p>
              <p><strong>Para deshacerlo:</strong> abre Ajustes del Sistema → General → Gestión de dispositivos y elimina el perfil de XDP. Si configuraste el DNS manualmente, vuelve a los valores anteriores o elimina solo las direcciones que añadiste.</p>
            </div>
          ) : null}

          {device === "android" ? (
            <div className="lumi-device-guide">
              <h3>Android</h3>
              <p>Prueba el DNS privado, que utiliza DNS sobre TLS. XDP publica el nombre de host <code>lite.xdp.es</code> para su servicio DNS estándar sin filtro de publicidad.</p>
              <ol>
                <li>Abre Ajustes y busca «DNS privado» (en algunos móviles está en Redes e Internet o Conexiones).</li>
                <li>Selecciona «Nombre de host del proveedor de DNS privado».</li>
                <li>Escribe <code>lite.xdp.es</code> y pulsa Guardar.</li>
                <li>Vuelve a la actividad y recarga la página.</li>
              </ol>
              <p><a href="https://support.google.com/android/answer/9654714?hl=es" target="_blank" rel="noopener noreferrer">Instrucciones oficiales de Android para DNS privado</a> · <a href={XDP_URL} target="_blank" rel="noopener noreferrer">Datos oficiales de XDP.es</a>.</p>
              <p><strong>Para deshacerlo:</strong> vuelve a DNS privado y selecciona «Automático».</p>
            </div>
          ) : null}

          {device === "windows" ? (
            <div className="lumi-device-guide">
              <h3>Windows 11</h3>
              <p>Estos pasos configuran DNS convencional para la conexión elegida. No activan DNS sobre HTTPS.</p>
              <ol>
                <li>Abre Configuración → Red e Internet.</li>
                <li>Selecciona Wi‑Fi y tu red, o Ethernet si usas cable.</li>
                <li>Busca Asignación de servidor DNS y pulsa Editar.</li>
                <li>Selecciona Manual, activa IPv4 e introduce <code>85.208.114.52</code> como DNS preferido y <code>51.170.54.40</code> como DNS alternativo.</li>
                <li>Guarda los cambios y recarga la actividad.</li>
              </ol>
              <p><a href="https://support.microsoft.com/es-es/windows/experience/connectivity-networking/essential-network-settings-and-tasks-in-windows" target="_blank" rel="noopener noreferrer">Guía oficial de Microsoft para configurar DNS</a> · <a href={XDP_URL} target="_blank" rel="noopener noreferrer">Direcciones oficiales de XDP.es</a>.</p>
              <p><strong>Para deshacerlo:</strong> vuelve a Editar la asignación de DNS y selecciona Automático (DHCP), si esa era la configuración anterior. Si no estás seguro, pide ayuda antes de cambiarlo.</p>
            </div>
          ) : null}

          {device === "chromebook" ? (
            <div className="lumi-device-guide">
              <h3>Chromebook</h3>
              <p>La disponibilidad de estos ajustes depende de la versión de ChromeOS y de si el centro administra el dispositivo.</p>
              <ol>
                <li>Abre Configuración → Red y selecciona tu conexión Wi‑Fi.</li>
                <li>Busca la sección de servidores de nombres y elige servidores personalizados, si aparece.</li>
                <li>Introduce <code>85.208.114.52</code> y <code>51.170.54.40</code> como servidores DNS.</li>
                <li>Guarda y vuelve a cargar la actividad.</li>
              </ol>
              <p><a href="https://support.google.com/chromebook/answer/6100591?hl=es" target="_blank" rel="noopener noreferrer">Ayuda oficial de Chromebook sobre DNS</a> · <a href={XDP_URL} target="_blank" rel="noopener noreferrer">Direcciones oficiales de XDP.es</a>.</p>
              <p><strong>Para deshacerlo:</strong> vuelve a la configuración de la conexión y selecciona el ajuste automático o predeterminado, si está disponible. Si la opción está bloqueada, contacta con el administrador del centro.</p>
            </div>
          ) : null}

          <div className="lumi-help-check">
            <h3>Comprueba si funciona</h3>
            <ol>
              <li>Vuelve a la actividad y recarga la página.</li>
              <li>Si sigue sin aparecer, abre la actividad directamente en Lumi.</li>
              <li>Si otras páginas también fallan, restaura la configuración anterior y pide ayuda a un adulto o al administrador de la red.</li>
            </ol>
            <p>Un cambio de DNS no garantiza resolver todos los bloqueos. No hemos podido verificar desde esta web que XDP permita cargar esta actividad concreta.</p>
            <a className="lumi-help-direct-link" href={activityUrl} target="_blank" rel="noopener noreferrer">Abrir la actividad directamente en Lumi</a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
