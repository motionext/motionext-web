import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL(`/auth/confirmation?success=false`, requestUrl.origin)
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/confirmation?success=false`, requestUrl.origin)
      );
    }

    // Redirecionar para a página de confirmação com sucesso
    return NextResponse.redirect(
      new URL(`/auth/confirmation?success=true`, requestUrl.origin)
    );
  } catch (error) {
    console.error("Error on email confirmation:", error);
    return NextResponse.redirect(
      new URL(`/auth/confirmation?success=false`, requestUrl.origin)
    );
  }
}
