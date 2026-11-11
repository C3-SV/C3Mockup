# 0003 · Alcance: solo páginas existentes; admin fuera
- **Fecha:** 2026-11-11 · **Responsable:** dueño del repo · **Estado:** aceptada

## Contexto
El DS describe pantallas de una plataforma con cuentas (explorar, acceso, perfil, propuesta, zona privada) que c3.com.sv no tiene.

## Decisión
Esta pasada aplica el DS únicamente a: home, `/compite`, `/crea`, `/conecta`, `/eventos`, `/contacto`, `/faq`, `/que-es-c3` y 404. `apps/admin` no se rediseña (el propio DS lo excluye) y solo recibe CI y pruebas. Esta ronda es de **documentación, plan y procesos**; el código del sitio no se toca hasta ejecutar el plan.

## Consecuencias
- Las pantallas ausentes se documentan como fases futuras en el plan, sin implementarlas.
- Los menús y el pie omiten enlaces a páginas que no existen (el DS pide no tener botones sin función).
