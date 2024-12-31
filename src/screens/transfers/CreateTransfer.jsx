import { Col, Row } from 'react-bootstrap';
import {
    ActionButtons,
    BreadCrumb,
    Button,
    Card,
    Input,
    Table,
    Toast,
} from '../../components';
import { useEffect, useRef, useState } from 'react';
import API from '../../app/API';
import { useNavigate } from 'react-router';
import App from '../../app/App';
import useDebounce from '../../components/Hooks/useDebounce';
import TransferModal from './TransferModal';
import { Messages } from '../../constants/Messages';

const breadcrumbItems = [
    {
        active: false,
        label: 'Transferencias',
        url: '/transferencias/list',
    },
    {
        active: true,
        label: 'Nueva transferencia',
    }
];

const CreateTransfer = () => {
    const columns = [
        {
            name: 'name',
            text: 'Nombre',
            textCenter: true,
        },
        {
            name: 'address',
            text: 'Direccion',
            textCenter: true,
        },
        {
            name: 'phone',
            text: 'Telefono',
            textCenter: true,
        },
        {
            name: 'debt',
            text: 'Deuda',
            textCenter: true,
        },
        {
            name: 'deliveryDay',
            text: 'Dia de reparto',
            textCenter: true,
        },
        {
            name: 'dealerName',
            text: 'Repartidor',
            textCenter: true,
        },
    ];

    const navigate = useNavigate();

    const transferModalRef = useRef();

    // States
    const [rows, setRows] = useState([]);
    const [searchFilter, setSearchFilter] = useState({ name: '', code: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedSearchFilter = useDebounce(searchFilter, 500);

    // Handlers
    const handleSearchClient = (value, isCode) => {
        setSearchFilter((prev) => ({
            ...prev,
            [isCode ? 'code' : 'name']: value
        }));
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSubmit = async (data) => {
        if (!data.amount) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        if (data.amount <= 0) {
            Toast.warning(Messages.Validation.amountGreaterThanZero);
            return;
        }

        const rq = {
            clientId: data.id,
            amount: data.amount
        };
        
        API.post('transfer/create', rq)
            .then((r) => {
                Toast.success(r.message);
                transferModalRef.current.close();
            }
        ).catch((r) => {
            Toast.error(r.error.message);
        });
    }

    const handleNewTransfer = (row) => {
        transferModalRef.current.open(
            (v) => handleSubmit(v),
            () => {},
            row,
            'Nueva',
        )
    }

    // Effects
    useEffect(() => {
        if (!App.isAdmin()) {
            return navigate('/notAllowed');
        }
    }, [navigate]);

    useEffect(() => {
        if (debouncedSearchFilter.name || debouncedSearchFilter.code ) {
            API.post('client/search', {
                Name: debouncedSearchFilter.name,
                Code: debouncedSearchFilter.code.toString(),
            }).then((r) => {
                setRows(r.data.clients);
            })
            .catch((r) => {
                Toast.error(r.error.message);
            });
        }
    },[debouncedSearchFilter]);

    const updateDeletedRow = (id) => {
        setRows((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <TransferModal ref={transferModalRef} />
            <BreadCrumb items={breadcrumbItems} title='Transferencias' />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Transferencias'
                        body={
                            <>
                                <Row>
                                    <Col xs={12} md={6} className='pe-3 mb-3 d-flex w-100 justify-content-between'>
                                        <Input
                                            borderless
                                            placeholder='Buscar'
                                            helpText='Nombre del cliente'
                                            value={searchFilter.name}
                                            onChange={(v) => handleSearchClient(v, false)}
                                        />
                                        <div className='align-self-end ms-2'>
                                            <Input
                                                type='number'
                                                borderless
                                                placeholder='#'
                                                helpText='Codigo del cliente'
                                                value={searchFilter.code.toString()}
                                                onChange={(v) => handleSearchClient(v, true)}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Table
                                    className='mb-5'
                                    columns={columns}
                                    rows={rows}
                                    pagination={true}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                    onUpdate={updateDeletedRow}
                                    clickable
                                    onRowClick={(row) => handleNewTransfer(row)}
                                />
                            </>
                        }
                    ></Card>
                </Col>
            </div>
        </>
    );
};

export default CreateTransfer;
