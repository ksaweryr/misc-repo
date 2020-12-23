section .text
    global _start
    
_start:
    xor r8, r8
    call clear
    
    mov rax, 1
    mov rsi, hide_cursor
    mov rdx, hide_cursor.len
    syscall
main:
    call get_window_dimensions
    shr word [ws+2], 1
    
    call get_time
    test qword [time], 1
    jnz .reset_clear_timer
    test r8, r8
    jnz .draw
    call clear
    mov rdi, red
    call set_colour
    mov r8, 1
    jmp .draw
    
    .reset_clear_timer:
        xor r8, r8
        mov rdi, green
        call set_colour
    .draw:
    mov rax, 1
    mov rdi, 1
    mov rsi, reset_cursor
    mov rdx, reset_cursor.len
    syscall
    
    mov rdi, 5
    call draw_tree
    jmp main    
    
.end:
    mov rax, 60
    xor rdi, rdi
    syscall ;sys_exit(0)


; ----> draw_tree(rdi height) <----
draw_tree:
    mov rcx, rdi           ;loop counter
    xor rdx, rdx
    mov dx, word [ws+2]   ;space count
    mov rbx, 1             ;stars count
    mov rdi, 1
    
    push rdx
    
    .loop:
        test rcx, rcx
        jz .end
        
        push rcx
        
        mov rax, 1
        mov rsi, spaces
        syscall
        
        push rdx
        
        mov rax, 1
        mov rsi, stars
        mov rdx, rbx
        syscall
        
        mov rax, 1
        mov rsi, LF
        mov rdx, 1
        syscall
        
        pop rdx
        
        pop rcx
        
        add rbx, 2
        dec rcx
        dec rdx
        jmp .loop
    
    .end:
    
    pop rdx
    
    mov rax, 1
    mov rsi, spaces
    syscall
    
    mov rax, 1
    mov rsi, stars
    mov rdx, 1
    syscall
    
    mov rax, 1
    mov rsi, LF
    syscall
    
    ret
; ----> end draw_tree <----

; ----> get_window_dimensions() <----
get_window_dimensions:
    mov rax, 16
    mov rdi, 1
    mov rsi, TIOCGWINSZ
    mov rdx, ws
    syscall  ;ioctl(0, TIOCGWINSZ, winsize)
    ret
; ----> end get_window_dimensions <----

; ----> clear() <----
clear:
    mov rax, 1
    mov rdi, 1
    mov rsi, clears
    mov rdx, clears.len
    syscall
    ret
; ----> end clear <----

; ----> get_time() <----
get_time:
    mov rax, 201
    mov rdi, time
    syscall  ;sys_time(time)
    ret
; ----> end get_time <----

; ----> set_colour(rdi colour) <----
set_colour:
    mov rax, 1
    mov rsi, rdi
    mov rdi, 1
    mov rdx, colour_len
    syscall
    ret
; ----> end set_colour <----

section .data
    spaces: times 256 db ' '
    stars:  times 256 db '*'
    LF: db 0xa
    
    clears: db 0x1b, '[2J'
    .len: equ $-clears
    reset_cursor: db 0x1b, '[1;1H'
    .len: equ $-reset_cursor
    hide_cursor: db 0x1b, '[?25l'
    .len: equ $-hide_cursor
    
    red: db 0x1b, '[31m'
    green: db 0x1b, '[32m'
    colour_len: equ $-green
    
    TIOCGWINSZ: equ 0x5413

section .bss
    ws: resw 4 ; word ws_row, word ws_col, word ws_xpixel, word ws_ypixel
    time: resq 1
