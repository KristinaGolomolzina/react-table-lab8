import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import {
    useReactTable, // Основной хук для создания и управления таблицей.
    getCoreRowModel, //  обеспечивает первичную отрисовку данных без дополнительных функций
    getFilteredRowModel, // добавляет возможность поиска/фильтрации данных в таблице
    getPaginationRowModel, // реализует разбиение данных на страницы
    getSortedRowModel, // добавляет возможность сортировки столбцов
    flexRender, // для рендеринга ячеек и заголовков.
} from "@tanstack/react-table";
import { useApi } from "../hooks/useApi";
import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


// Компонент для перетаскиваемой колонки (@dnd-kit)
const SortableColumnHeader = ({ header, colors }) => {
    const {
        attributes,
        listeners, // обработчики событий (клик, перетаскивание)
        setNodeRef,
        transform, //  объект с CSS‑трансформациями 
        transition, //  CSS‑переход для плавной анимации
        isDragging, // флаг (true/false) перетаскивается ли элемент
    } = useSortable({
        id: header.column.id,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: isDragging ? `${colors.primary}80` : colors.primary,
        opacity: isDragging ? 0.8 : 1,
        position: header.column.columnDef.sticky === 'left' ? 'sticky' : 'relative',
        left: header.column.columnDef.sticky === 'left' ? 0 : 'auto',
        zIndex: isDragging ? 10 : (header.column.columnDef.sticky === 'left' ? 2 : 1),
        borderRight: header.column.columnDef.sticky === 'left' ? `2px solid ${colors.text}20` : 'none',
        width: header.column.getSize(),
        minWidth: header.column.columnDef.minSize,
    }

    return (
        <th
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={header.column.getToggleSortingHandler()}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px' }}>
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                    asc: '🔼',
                    desc: '🔽',
                }[header.column.getIsSorted()] ?? null}
            </div>
        </th>
    )
}

const UsersTable = () => {
    const { colors } = useContext(ThemeContext);
    const {
        users,
        loading,
        error,
        loadUsers,
        updateUser,
        removeUser,
        clearApiError
    } = useApi()

    const [isInitialized, setIsInitialized] = useState(false)
    const [columnOrder, setColumnOrder] = useState([])
    const [activeId, setActiveId] = useState(null)
    
    // Состояния для виртуализации
    const [scrollTop, setScrollTop] = useState(0)
    const tableContainerRef = useRef(null)
    const rowHeight = 60

    // Настройка сенсоров для перетаскивания
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1, // 1px - нужно немного переместить для начала перетаскивания
            },
        })
    )

    // Загрузка пользователей при монтировании компонента
    useEffect(() => {
        if (!isInitialized) {
            loadUsers()
            setIsInitialized(true)
        }
    }, [isInitialized, loadUsers])

    // Обработчик скролла для виртуализации
    const handleScroll = useCallback((e) => {
        setScrollTop(e.target.scrollTop)
    }, [])

    // Настройки виртуализации
    const visibleRows = useMemo(() => {
        if (!tableContainerRef.current) return { start: 0, end: 20 };
        
        const containerHeight = tableContainerRef.current.clientHeight;
        const startIndex = Math.floor(scrollTop / rowHeight);
        const visibleRowCount = Math.ceil(containerHeight / rowHeight);
        const endIndex = startIndex + visibleRowCount + 5;
        
        return {
            start: Math.max(0, startIndex - 5),
            end: Math.min(users?.length || 0, endIndex)
        };
    }, [scrollTop, users?.length])

    // Обработчики действий
    const handleToggleUser = useCallback(async (userId, currentStatus) => {
        if (window.confirm(`Вы уверены, что хотите ${currentStatus ? 'заблокировать' : 'разблокировать'} этого пользователя?`)) {
            try {
                await updateUser(userId, { isActive: !currentStatus });
                loadUsers();
            } catch (err) {
                console.error('Ошибка при обновлении пользователя:', err);
            }
        }
    }, [updateUser, loadUsers]);

    const handleDeleteUser = useCallback(async (userId, username) => {
        if (window.confirm(`Вы уверены, что хотите удалить пользователя "${username}"?`)) {
            try {
                await removeUser(userId);
                loadUsers();
            } catch (err) {
                console.error('Ошибка при удалении пользователя:', err);
            }
        }
    }, [removeUser, loadUsers]);

    // Обработчики перетаскивания с @dnd-kit
    const handleDragStart = useCallback((event) => {
        setActiveId(event.active.id);
    }, []);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over?.id) {
            setColumnOrder((columnOrder) => {
                const oldIndex = columnOrder.indexOf(active.id);
                const newIndex = columnOrder.indexOf(over.id);
                
                return arrayMove(columnOrder, oldIndex, newIndex);
            });
        }
    }, []);

    // Определяем колонки таблицы
    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 80,
            minSize: 60,
            enableSorting: true,
            sticky: 'left',
            cell: ({ getValue }) => (
                <div style={{
                    padding: '8px 4px',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'inherit',
                    borderRight: `2px solid ${colors.text}20`
                }}>
                    {getValue()}
                </div>
            )
        },
        {
            accessorKey: 'username',
            header: 'Имя пользователя',
            size: 150,
            minSize: 120,
            enableSorting: true,
        },
        {
            accessorKey: 'role',
            header: 'Роль',
            size: 120,
            minSize: 100,
            enableSorting: true,
            cell: ({ getValue }) => (
                <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getValue() === 'admin' ? '#dc3545' : '#28a745',
                    color: 'white',
                    fontSize: '12px'
                }}>
                    {getValue() === 'admin' ? 'Администратор' : 'Пользователь'}
                </span>
            )
        },
        {
            accessorKey: 'isActive',
            header: 'Статус',
            size: 120,
            minSize: 100,
            enableSorting: true,
            cell: ({ getValue }) => (
                <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getValue() ? '#28a745' : '#dc3545',
                    color: 'white',
                    fontSize: '12px'
                }}>
                    {getValue() ? 'Активен' : 'Заблокирован'}
                </span>
            )
        },
        {
            accessorKey: 'createdAt',
            header: 'Дата регистрации',
            size: 150,
            minSize: 120,
            enableSorting: true,
            cell: ({ getValue }) => {
                const date = new Date(getValue());
                return date.toLocaleDateString('ru-RU');
            }
        },
        {
            id: 'actions',
            header: 'Действия',
            size: 200,
            minSize: 180,
            enableSorting: false,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => handleToggleUser(user.id, user.isActive)}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: user.isActive ? '#dc3545' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                minWidth: '100px'
                            }}
                            title={user.isActive ? 'Заблокировать' : 'Разблокировать'}
                        >
                            {user.isActive ? 'Заблокировать' : 'Разблокировать'}
                        </button>

                        <button
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                minWidth: '80px'
                            }}
                            title="Удалить пользователя"
                        >
                            🗑️ Удалить
                        </button>
                    </div>
                );
            }
        }
    ], [handleToggleUser, handleDeleteUser, colors.text]);

    // Инициализируем порядок колонок
    useEffect(() => {
        if (columns.length > 0 && columnOrder.length === 0) {
            setColumnOrder(columns.map(column => column.accessorKey || column.id));
        }
    }, [columns, columnOrder.length]);

    // Создаем экземпляр таблицы
    const table = useReactTable({
        data: users || [],
        columns,
        state: { 
            columnOrder,
            pagination: {
                pageIndex: 0,
                pageSize: 50
            }
        },
        onColumnOrderChange: setColumnOrder,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (loading && !isInitialized) {
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                color: colors.text
            }}>
                <p>Загрузка пользователей...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#dc3545'
            }}>
                <p>Ошибка при загрузке пользователей</p>
                <div style={{ fontSize: '14px', marginTop: '10px' }}>
                    {error}
                </div>
                <button
                    onClick={() => {
                        clearApiError();
                        loadUsers();
                    }}
                    style={{
                        marginTop: '10px',
                        padding: '8px 16px',
                        backgroundColor: colors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div style={{
            padding: '20px',
            backgroundColor: colors.background,
            color: colors.text,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h3 style={{ marginBottom: '20px' }}>
                Управление пользователями ({users?.length || 0})
            </h3>

            {/* Подсказка по функционалу */}
            <div style={{
                background: '#e7f3ff',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                fontSize: '14px',
                color: '#0066cc',
                border: '1px solid #b3d9ff'
            }}>
                <strong>Новые функции:</strong> 
                <br/>- <strong>Виртуализация:</strong> Плавная работа с большими данными
                <br/>- <strong>Перетаскивание колонок</strong>
            </div>

            {/* Таблица с виртуализацией и мобильным скроллом */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div 
                    ref={tableContainerRef}
                    style={{
                        border: `1px solid ${colors.text}20`,
                        borderRadius: '8px',
                        overflow: 'auto',
                        flex: 1,
                        position: 'relative'
                    }}
                    onScroll={handleScroll}
                >
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: colors.background,
                        minWidth: '800px'
                    }}>
                        <thead style={{
                            backgroundColor: colors.primary,
                            color: 'white',
                            position: 'sticky',
                            top: 0,
                            zIndex: 3
                        }}>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    <SortableContext 
                                        items={columnOrder}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        {headerGroup.headers.map(header => (
                                            <SortableColumnHeader 
                                                key={header.id} 
                                                header={header}
                                                colors={colors}
                                            />
                                        ))}
                                    </SortableContext>
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {/* Виртуализация - рендерим только видимые строки */}
                            {table.getRowModel().rows.slice(visibleRows.start, visibleRows.end).map((row, index) => {
                                const actualIndex = visibleRows.start + index;
                                return (
                                    <tr 
                                        key={row.id}
                                        style={{
                                            borderBottom: `1px solid ${colors.text}20`,
                                            backgroundColor: actualIndex % 2 === 0 ? `${colors.text}08` : 'transparent',
                                            height: `${rowHeight}px`
                                        }}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td
                                                key={cell.id}
                                                style={{
                                                    padding: '12px',
                                                    borderBottom: `1px solid ${colors.text}10`,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '200px',
                                                    position: cell.column.columnDef.sticky === 'left' ? 'sticky' : 'relative',
                                                    left: cell.column.columnDef.sticky === 'left' ? 0 : 'auto',
                                                    backgroundColor: 'inherit',
                                                    zIndex: cell.column.columnDef.sticky === 'left' ? 1 : 'auto'
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                            
                            {/* Пустое пространство для виртуализации */}
                            {visibleRows.start > 0 && (
                                <tr>
                                    <td 
                                        colSpan={columns.length}
                                        style={{
                                            height: `${visibleRows.start * rowHeight}px`,
                                            border: 'none'
                                        }}
                                    />
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Drag Overlay для лучшего UX */}
                <DragOverlay>
                    {activeId ? (
                        <div style={{
                            backgroundColor: `${colors.primary}80`,
                            padding: '12px',
                            borderRadius: '4px',
                            cursor: 'grabbing',
                            opacity: 0.8
                        }}>
                            {activeId}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Пагинация */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
                padding: '12px',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span>
                        Страница {table.getState().pagination.pageIndex + 1} из{' '}
                        {table.getPageCount()}
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        style={{
                            padding: '4px',
                            border: `1px solid ${colors.text}40`,
                            borderRadius: '4px',
                            backgroundColor: colors.background,
                            color: colors.text
                        }}
                    >
                        {[10, 20, 50, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Показать {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: colors.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: table.getCanPreviousPage() ? 'pointer' : 'not-allowed',
                            opacity: table.getCanPreviousPage() ? 1 : 0.5
                        }}
                    >
                        Назад
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: colors.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: table.getCanNextPage() ? 'pointer' : 'not-allowed',
                            opacity: table.getCanNextPage() ? 1 : 0.5
                        }}
                    >
                        Вперед
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UsersTable